import { describe, expect, it, vi } from "vitest";
import type { ArizeClient } from "../../types";
import * as resolveModule from "../../utils/resolve";
import { createTask } from "../createTask";

const DATASET_ID = "RGF0YXNldDoxOmFCY0Q=";
const PROJECT_ID = "UHJvamVjdDoxOmFCY0Q=";
const INTEGRATION_ID = "TGxtSW50ZWdyYXRpb246MTphQmNE";
const TASK_ID = "T25saW5lVGFzazo0NTphQmNE";
const CREATED_AT = "2026-04-01T10:00:00.000Z";

function makeTaskResponse(type = "template_evaluation") {
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
  it("creates a template_evaluation task with a project", async () => {
    vi.spyOn(resolveModule, "findProjectId").mockResolvedValue(PROJECT_ID);
    const client = makeClient();

    const task = await createTask({
      client,
      name: "Eval Task",
      type: "template_evaluation",
      project: PROJECT_ID,
      evaluators: [{ evaluatorId: "ev-1" }],
    });

    expect(client.POST).toHaveBeenCalledWith("/v2/tasks", {
      body: expect.objectContaining({
        name: "Eval Task",
        type: "template_evaluation",
        project_id: PROJECT_ID,
      }),
    });
    expect(task.id).toBe(TASK_ID);
  });

  it("creates a code_evaluation task with a dataset and experiment_ids", async () => {
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(DATASET_ID);
    const client = makeClient(makeTaskResponse("code_evaluation"));

    await createTask({
      client,
      name: "Code Eval",
      type: "code_evaluation",
      dataset: DATASET_ID,
      experimentIds: ["exp-1"],
      evaluators: [{ evaluatorId: "ev-2" }],
    });

    expect(client.POST).toHaveBeenCalledWith("/v2/tasks", {
      body: expect.objectContaining({
        type: "code_evaluation",
        dataset_id: DATASET_ID,
        experiment_ids: ["exp-1"],
      }),
    });
  });

  it("creates a run_experiment task with a dataset and runConfiguration", async () => {
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(DATASET_ID);
    const client = makeClient(makeTaskResponse("run_experiment"));

    await createTask({
      client,
      name: "Run Exp Task",
      type: "run_experiment",
      dataset: DATASET_ID,
      runConfiguration: {
        experiment_type: "llm_generation",
        ai_integration_id: INTEGRATION_ID,
        input_variable_format: "f_string",
        messages: [{ role: "user", content: "{q}" }],
      },
    });

    expect(client.POST).toHaveBeenCalledWith("/v2/tasks", {
      body: expect.objectContaining({
        type: "run_experiment",
        dataset_id: DATASET_ID,
        run_configuration: expect.objectContaining({
          experiment_type: "llm_generation",
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
        type: "template_evaluation",
        project: PROJECT_ID,
        evaluators: [],
      }),
    ).rejects.toThrow("bad request");
  });
});
