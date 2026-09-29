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

  it("maps query_filters and expression for trace/session tasks", async () => {
    await updateTask({
      client: mockClient,
      task: "tid",
      queryFilters: {
        filters: [{ id: "A", filter: "span_kind == 'CHAIN'" }],
        expression: "A",
      },
      evaluators: [
        {
          evaluatorId: "ev-1",
          queryMappings: [
            {
              variableName: "output",
              queryIds: ["A"],
              attributePath: "attributes.output.value",
            },
          ],
        },
      ],
    });

    expect(patch).toHaveBeenCalledWith("/v2/tasks/{task_id}", {
      params: { path: { task_id: "resolved-task-id" } },
      body: {
        query_filters: {
          filters: [{ id: "A", filter: "span_kind == 'CHAIN'" }],
          expression: "A",
        },
        evaluators: [
          {
            evaluator_id: "ev-1",
            query_filter: undefined,
            evaluator_version_id: undefined,
            column_mappings: undefined,
            query_mappings: [
              {
                variable_name: "output",
                query_ids: ["A"],
                attribute_path: "attributes.output.value",
              },
            ],
          },
        ],
      },
    });
  });

  it("clears query_filters by passing null", async () => {
    await updateTask({
      client: mockClient,
      task: "tid",
      queryFilters: null,
    });

    expect(patch).toHaveBeenCalledWith("/v2/tasks/{task_id}", {
      params: { path: { task_id: "resolved-task-id" } },
      body: {
        query_filters: null,
      },
    });
  });

  it("throws when queryFilter and queryFilters both carry actual values", async () => {
    await expect(
      updateTask({
        client: mockClient,
        task: "tid",
        queryFilter: "span_kind == 'LLM'",
        queryFilters: {
          filters: [{ id: "A", filter: "span_kind == 'CHAIN'" }],
        },
      }),
    ).rejects.toThrow(/mutually exclusive/);

    expect(patch).not.toHaveBeenCalled();
  });

  it("allows queryFilter set together with queryFilters: null (switch to span shape)", async () => {
    await updateTask({
      client: mockClient,
      task: "tid",
      queryFilter: "span_kind == 'LLM'",
      queryFilters: null,
    });

    expect(patch).toHaveBeenCalledWith("/v2/tasks/{task_id}", {
      params: { path: { task_id: "resolved-task-id" } },
      body: {
        query_filter: "span_kind == 'LLM'",
        query_filters: null,
      },
    });
  });

  it("allows queryFilters set together with queryFilter: null (switch to trace/session shape)", async () => {
    await updateTask({
      client: mockClient,
      task: "tid",
      queryFilter: null,
      queryFilters: {
        filters: [{ id: "A", filter: "span_kind == 'CHAIN'" }],
      },
      evaluators: [
        {
          evaluatorId: "ev-1",
          queryMappings: [
            {
              variableName: "output",
              queryIds: ["A"],
              attributePath: "attributes.output.value",
            },
          ],
        },
      ],
    });

    expect(patch).toHaveBeenCalledTimes(1);
    const [, requestInit] = patch.mock.calls[0] as [
      string,
      { body: Record<string, unknown> },
    ];
    expect(requestInit.body.query_filter).toBeNull();
    expect(requestInit.body.query_filters).toEqual({
      filters: [{ id: "A", filter: "span_kind == 'CHAIN'" }],
      expression: undefined,
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

  it("propagates the custom code evaluator limit", async () => {
    patch.mockResolvedValue({
      error: {
        detail:
          "Only one custom code evaluator runs per task. Create one task per custom evaluator.",
        title: "Unprocessable Entity",
      },
      data: undefined,
    });

    await expect(
      updateTask({
        client: mockClient,
        task: "tid",
        evaluators: [{ evaluatorId: "custom-1" }, { evaluatorId: "custom-2" }],
      }),
    ).rejects.toThrow("Only one custom code evaluator");
  });
});
