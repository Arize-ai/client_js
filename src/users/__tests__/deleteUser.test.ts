import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteUser } from "../deleteUser";

describe("deleteUser", () => {
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
  });

  it("calls DELETE /v2/users/{user_id} with correct path param", async () => {
    await deleteUser({
      client: mockClient,
      userId: "VXNlcjoxMjM0NQ==",
    });

    expect(deleteFn).toHaveBeenCalledTimes(1);
    expect(deleteFn).toHaveBeenCalledWith("/v2/users/{user_id}", {
      params: {
        path: {
          user_id: "VXNlcjoxMjM0NQ==",
        },
      },
    });
  });

  it("throws when API returns error", async () => {
    deleteFn.mockResolvedValue({
      error: { detail: "user not found", title: "Not Found" },
    });

    await expect(
      deleteUser({
        client: mockClient,
        userId: "bad-id",
      }),
    ).rejects.toThrow("user not found");
  });
});
