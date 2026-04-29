import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { mockTask } from "./fixtures";
import { updateTask } from "../updateTask";

describe("updateTask", () => {
  const patch = vi.fn();

  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patch.mockReset();
    patch.mockResolvedValue({
      error: undefined,
      data: mockTask,
    });
    vi.spyOn(resolveModule, "findTaskId").mockResolvedValue("resolved-task-id");
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("calls PATCH with name in body", async () => {
    await updateTask({
      client: mockClient,
      task: "My Task",
      space: "my-space",
      name: "Renamed Task",
    });

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledWith("/v2/tasks/{task_id}", {
      params: { path: { task_id: "resolved-task-id" } },
      body: { name: "Renamed Task" },
    });
  });

  it("maps samplingRate and queryFilter clear", async () => {
    await updateTask({
      client: mockClient,
      task: "tid",
      samplingRate: 0.75,
      queryFilter: null,
    });

    expect(patch).toHaveBeenCalledWith("/v2/tasks/{task_id}", {
      params: { path: { task_id: "resolved-task-id" } },
      body: {
        sampling_rate: 0.75,
        query_filter: null,
      },
    });
  });

  it("maps evaluators via toRawTaskEvaluator shape", async () => {
    await updateTask({
      client: mockClient,
      task: "tid",
      evaluators: [
        {
          evaluatorId: "ev-1",
          queryFilter: "span_kind == 'LLM'",
          columnMappings: { input: "a", output: "b" },
        },
      ],
    });

    expect(patch).toHaveBeenCalledWith("/v2/tasks/{task_id}", {
      params: { path: { task_id: "resolved-task-id" } },
      body: {
        evaluators: [
          {
            evaluator_id: "ev-1",
            query_filter: "span_kind == 'LLM'",
            column_mappings: { input: "a", output: "b" },
          },
        ],
      },
    });
  });

  it("throws when no mutable fields are provided", async () => {
    await expect(
      updateTask({
        client: mockClient,
        task: "tid",
      }),
    ).rejects.toThrow(/At least one update field must be provided/);

    expect(patch).not.toHaveBeenCalled();
  });

  it("throws when API returns error", async () => {
    patch.mockResolvedValue({
      error: { detail: "not found", title: "Error" },
      data: undefined,
    });

    await expect(
      updateTask({
        client: mockClient,
        task: "tid",
        name: "x",
      }),
    ).rejects.toThrow("not found");
  });
});
