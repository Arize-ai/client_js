import { describe, expect, it, vi } from "vitest";
import type { ArizeClient } from "../../types";
import * as resolveModule from "../../utils/resolve";
import { createEvaluationTask } from "../createEvaluationTask";

const PROJECT_ID = "UHJvamVjdDoxOmFCY0Q=";
const TASK_ID = "T25saW5lVGFzazo0NTphQmNE";
const CREATED_AT = "2026-04-01T10:00:00.000Z";

function makeClient(): ArizeClient {
  const postMock = vi.fn().mockResolvedValue({
    data: {
      id: TASK_ID,
      name: "Eval Task",
      type: "template_evaluation",
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
    },
    error: undefined,
  });
  return { POST: postMock } as unknown as ArizeClient;
}

describe("createEvaluationTask", () => {
  it("delegates to createTask with type=template_evaluation", async () => {
    vi.spyOn(resolveModule, "findProjectId").mockResolvedValue(PROJECT_ID);
    const client = makeClient();

    const task = await createEvaluationTask({
      client,
      name: "Eval Task",
      type: "template_evaluation",
      project: PROJECT_ID,
      evaluators: [{ evaluatorId: "ev-1" }],
    });

    expect(client.POST).toHaveBeenCalledWith("/v2/tasks", {
      body: expect.objectContaining({
        type: "template_evaluation",
        project_id: PROJECT_ID,
      }),
    });
    expect(task.id).toBe(TASK_ID);
  });

  it("delegates to createTask with type=code_evaluation", async () => {
    vi.spyOn(resolveModule, "findProjectId").mockResolvedValue(PROJECT_ID);
    const client = makeClient();

    await createEvaluationTask({
      client,
      name: "Code Task",
      type: "code_evaluation",
      project: PROJECT_ID,
      evaluators: [],
    });

    expect(client.POST).toHaveBeenCalledWith("/v2/tasks", {
      body: expect.objectContaining({ type: "code_evaluation" }),
    });
  });

  it("throws when type is not an eval type", async () => {
    const client = makeClient();
    await expect(
      createEvaluationTask({
        client,
        // @ts-expect-error intentionally passing wrong type
        type: "run_experiment",
        name: "Bad",
        evaluators: [],
      }),
    ).rejects.toThrow(/createEvaluationTask only supports/);
  });

  it("returns the transformed task", async () => {
    vi.spyOn(resolveModule, "findProjectId").mockResolvedValue(PROJECT_ID);
    const client = makeClient();

    const task = await createEvaluationTask({
      client,
      name: "Eval Task",
      type: "template_evaluation",
      project: PROJECT_ID,
      evaluators: [],
    });

    expect(task.id).toBe(TASK_ID);
    expect(task.type).toBe("template_evaluation");
  });
});
