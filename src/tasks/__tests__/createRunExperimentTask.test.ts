import { afterEach, describe, expect, it, vi } from "vitest";
import type { ArizeClient } from "../../types";
import * as resolveModule from "../../utils/resolve";
import { createRunExperimentTask } from "../createRunExperimentTask";

const DATASET_ID = "RGF0YXNldDoxOmFCY0Q=";
const INTEGRATION_ID = "TGxtSW50ZWdyYXRpb246MTphQmNE";
const TASK_ID = "T25saW5lVGFzazo0NTphQmNE";
const CREATED_AT = "2026-04-01T10:00:00.000Z";

function makeTaskResponse() {
  return {
    id: TASK_ID,
    name: "Run Exp Task",
    type: "RUN_EXPERIMENT",
    dataset_id: DATASET_ID,
    project_id: null,
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

function makeClient(postError?: object): ArizeClient {
  const postMock = vi
    .fn()
    .mockResolvedValue(
      postError
        ? { error: postError }
        : { data: makeTaskResponse(), error: undefined },
    );
  return { POST: postMock } as unknown as ArizeClient;
}

describe("createRunExperimentTask", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a RUN_EXPERIMENT task with LLM_GENERATION config", async () => {
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(DATASET_ID);
    const client = makeClient();

    const task = await createRunExperimentTask({
      client,
      name: "Run Exp Task",
      dataset: DATASET_ID,
      runConfiguration: {
        experiment_type: "LLM_GENERATION",
        ai_integration_id: INTEGRATION_ID,
        model_name: "gpt-4o",
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
    expect(task.id).toBe(TASK_ID);
  });

  it("creates a RUN_EXPERIMENT task with TEMPLATE_EVALUATION config", async () => {
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(DATASET_ID);
    const client = makeClient();

    await createRunExperimentTask({
      client,
      name: "Template Eval Task",
      dataset: DATASET_ID,
      runConfiguration: {
        experiment_type: "TEMPLATE_EVALUATION",
        ai_integration_id: INTEGRATION_ID,
        template: "Rate the answer: {{answer}}",
        provide_explanation: false,
      },
    });

    expect(client.POST).toHaveBeenCalledWith("/v2/tasks", {
      body: expect.objectContaining({
        run_configuration: expect.objectContaining({
          experiment_type: "TEMPLATE_EVALUATION",
        }),
      }),
    });
  });

  it("resolves aiIntegration name to ID via findAiIntegrationId", async () => {
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(DATASET_ID);
    vi.spyOn(resolveModule, "findAiIntegrationId").mockResolvedValue(
      INTEGRATION_ID,
    );
    const client = makeClient();

    await createRunExperimentTask({
      client,
      name: "Task",
      dataset: DATASET_ID,
      space: "my-space",
      runConfiguration: {
        experiment_type: "LLM_GENERATION",
        aiIntegration: "my-integration",
        ai_integration_id: "",
        input_variable_format: "F_STRING",
        messages: [{ role: "USER", content: "{q}" }],
      },
    });

    expect(resolveModule.findAiIntegrationId).toHaveBeenCalledWith(
      client,
      "my-integration",
      expect.anything(),
    );

    expect(client.POST).toHaveBeenCalledWith("/v2/tasks", {
      body: expect.objectContaining({
        run_configuration: expect.objectContaining({
          ai_integration_id: INTEGRATION_ID,
        }),
      }),
    });
  });

  it("throws when the API returns an error", async () => {
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(DATASET_ID);
    const client = makeClient({ detail: "name conflict", title: "Conflict" });

    await expect(
      createRunExperimentTask({
        client,
        name: "Dup Task",
        dataset: DATASET_ID,
        runConfiguration: {
          experiment_type: "LLM_GENERATION",
          ai_integration_id: INTEGRATION_ID,
          input_variable_format: "F_STRING",
          messages: [{ role: "USER", content: "{q}" }],
        },
      }),
    ).rejects.toThrow("name conflict");
  });
});
