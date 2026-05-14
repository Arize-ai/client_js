import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeSpaceUser } from "../removeSpaceUser";

describe("removeSpaceUser", () => {
  const deleteFn = vi.fn();

  const mockClient = {
    DELETE: deleteFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    deleteFn.mockReset();
    deleteFn.mockResolvedValue({ error: undefined, data: undefined });
  });

  it("calls DELETE /v2/spaces/{space_id}/users/{user_id} with correct params", async () => {
    await removeSpaceUser({
      client: mockClient,
      spaceId: "U3BhY2U6YWJjMTIz",
      userId: "VXNlcjoxMjM0NQ==",
    });

    expect(deleteFn).toHaveBeenCalledTimes(1);
    expect(deleteFn).toHaveBeenCalledWith(
      "/v2/spaces/{space_id}/users/{user_id}",
      {
        params: {
          path: { space_id: "U3BhY2U6YWJjMTIz", user_id: "VXNlcjoxMjM0NQ==" },
        },
      },
    );
  });

  it("throws when API returns error", async () => {
    deleteFn.mockResolvedValue({
      error: { detail: "user not found", title: "Not Found" },
    });

    await expect(
      removeSpaceUser({
        client: mockClient,
        spaceId: "U3BhY2U6YWJjMTIz",
        userId: "VXNlcjoxMjM0NQ==",
      }),
    ).rejects.toThrow("user not found");
  });
});
