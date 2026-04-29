import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { deleteTask } from "../deleteTask";

describe("deleteTask", () => {
  const deleteFn = vi.fn();

  const mockClient = {
    DELETE: deleteFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    deleteFn.mockReset();
    deleteFn.mockResolvedValue({
      error: undefined,
      response: new Response(null, { status: 204 }),
    });
    vi.spyOn(resolveModule, "findTaskId").mockResolvedValue("resolved-task-id");
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("calls DELETE with resolved task id", async () => {
    await deleteTask({
      client: mockClient,
      task: "My Task",
      space: "space-1",
    });

    expect(deleteFn).toHaveBeenCalledTimes(1);
    expect(deleteFn).toHaveBeenCalledWith("/v2/tasks/{task_id}", {
      params: {
        path: {
          task_id: "resolved-task-id",
        },
      },
    });
  });

  it("throws when API returns error", async () => {
    deleteFn.mockResolvedValue({
      error: { detail: "gone", title: "Error" },
    });

    await expect(
      deleteTask({
        client: mockClient,
        task: "tid",
      }),
    ).rejects.toThrow("gone");
  });
});
