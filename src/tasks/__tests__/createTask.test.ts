import { describe, expect, it, vi } from "vitest";
import type { ArizeClient } from "../../types";
import * as resolveModule from "../../utils/resolve";
import { createTask } from "../createTask";

const DATASET_ID = "RGF0YXNldDoxOmFCY0Q=";
const PROJECT_ID = "UHJvamVjdDoxOmFCY0Q=";
const INTEGRATION_ID = "TGxtSW50ZWdyYXRpb246MTphQmNE";
const TASK_ID = "T25saW5lVGFzazo0NTphQmNE";
const CREATED_AT = "2026-04-01T10:00:00.000Z";

function makeTaskResponse(type = "TEMPLATE_EVALUATION") {
  return {
    id: TASK_ID,
    name: "My Task",
    type,
    dataset_id: null,
    project_id: PROJECT_ID,
    sampling_rate: null,
    is_continuous: false,
    query_filter: null,
    evaluators: [],
    experiment_ids: [],
    run_configuration: null,
    last_run_at: null,
    created_at: CREATED_AT,
    updated_at: CREATED_AT,
    created_by_user_id: "user-1",
  };
}

function makeClient(postResult?: object, postError?: object): ArizeClient {
  const postMock = vi
    .fn()
    .mockResolvedValue(
      postError
        ? { error: postError }
        : { data: postResult ?? makeTaskResponse(), error: undefined },
    );
  return { POST: postMock } as unknown as ArizeClient;
}

describe("createTask", () => {
  it("creates a TEMPLATE_EVALUATION task with a project", async () => {
    vi.spyOn(resolveModule, "findProjectId").mockResolvedValue(PROJECT_ID);
    const client = makeClient();

    const task = await createTask({
      client,
      name: "Eval Task",
      type: "TEMPLATE_EVALUATION",
      project: PROJECT_ID,
      evaluators: [{ evaluatorId: "ev-1" }],
    });

    expect(client.POST).toHaveBeenCalledWith("/v2/tasks", {
      body: expect.objectContaining({
        name: "Eval Task",
        type: "TEMPLATE_EVALUATION",
        project_id: PROJECT_ID,
      }),
    });
    expect(task.id).toBe(TASK_ID);
  });

  it("creates a CODE_EVALUATION task with a dataset and experiment_ids", async () => {
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(DATASET_ID);
    const client = makeClient(makeTaskResponse("CODE_EVALUATION"));

    await createTask({
      client,
      name: "Code Eval",
      type: "CODE_EVALUATION",
      dataset: DATASET_ID,
      experimentIds: ["exp-1"],
      evaluators: [{ evaluatorId: "ev-2" }],
    });

    expect(client.POST).toHaveBeenCalledWith("/v2/tasks", {
      body: expect.objectContaining({
        type: "CODE_EVALUATION",
        dataset_id: DATASET_ID,
        experiment_ids: ["exp-1"],
      }),
    });
  });

  it("creates a RUN_EXPERIMENT task with a dataset and runConfiguration", async () => {
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(DATASET_ID);
    const client = makeClient(makeTaskResponse("RUN_EXPERIMENT"));

    await createTask({
      client,
      name: "Run Exp Task",
      type: "RUN_EXPERIMENT",
      dataset: DATASET_ID,
      runConfiguration: {
        experiment_type: "LLM_GENERATION",
        ai_integration_id: INTEGRATION_ID,
        input_variable_format: "F_STRING",
        messages: [{ role: "USER", content: "{q}" }],
      },
    });

    expect(client.POST).toHaveBeenCalledWith("/v2/tasks", {
      body: expect.objectContaining({
        type: "RUN_EXPERIMENT",
        dataset_id: DATASET_ID,
        run_configuration: expect.objectContaining({
          experiment_type: "LLM_GENERATION",
          ai_integration_id: INTEGRATION_ID,
        }),
      }),
    });
  });

  it("throws when the API returns an error", async () => {
    vi.spyOn(resolveModule, "findProjectId").mockResolvedValue(PROJECT_ID);
    const client = makeClient(undefined, {
      detail: "bad request",
      title: "Error",
    });

    await expect(
      createTask({
        client,
        name: "Bad Task",
        type: "TEMPLATE_EVALUATION",
        project: PROJECT_ID,
        evaluators: [],
      }),
    ).rejects.toThrow("bad request");
  });
});
