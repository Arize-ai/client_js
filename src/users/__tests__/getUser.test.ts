import { beforeEach, describe, expect, it, vi } from "vitest";
import { getUser } from "../getUser";
import { mockRawUser } from "./fixtures";

describe("getUser", () => {
  const getFn = vi.fn();

  const mockClient = {
    GET: getFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    getFn.mockReset();
    getFn.mockResolvedValue({
      error: undefined,
      data: mockRawUser,
    });
  });

  it("calls GET /v2/users/{user_id} with correct path param", async () => {
    await getUser({
      client: mockClient,
      userId: "VXNlcjoxMjM0NQ==",
    });

    expect(getFn).toHaveBeenCalledTimes(1);
    expect(getFn).toHaveBeenCalledWith("/v2/users/{user_id}", {
      params: {
        path: { user_id: "VXNlcjoxMjM0NQ==" },
      },
    });
  });

  it("transforms response data correctly", async () => {
    const user = await getUser({
      client: mockClient,
      userId: "VXNlcjoxMjM0NQ==",
    });

    expect(user).toEqual({
      id: mockRawUser.id,
      name: mockRawUser.name,
      email: mockRawUser.email,
      role: mockRawUser.role,
      status: mockRawUser.status,
      createdAt: new Date(mockRawUser.created_at),
      isDeveloper: mockRawUser.is_developer,
    });
  });

  it("throws when API returns error", async () => {
    getFn.mockResolvedValue({
      error: { detail: "user not found", title: "Not Found" },
    });

    await expect(
      getUser({ client: mockClient, userId: "bad-id" }),
    ).rejects.toThrow("user not found");
  });
});
