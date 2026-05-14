import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateUser } from "../updateUser";
import { mockRawUser } from "./fixtures";

describe("updateUser", () => {
  const patchFn = vi.fn();

  const mockClient = {
    PATCH: patchFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patchFn.mockReset();
    patchFn.mockResolvedValue({
      error: undefined,
      data: mockRawUser,
    });
  });

  it("calls PATCH /v2/users/{user_id} with name and isDeveloper", async () => {
    await updateUser({
      client: mockClient,
      userId: "VXNlcjoxMjM0NQ==",
      name: "Jane Smith Updated",
      isDeveloper: true,
    });

    expect(patchFn).toHaveBeenCalledTimes(1);
    expect(patchFn).toHaveBeenCalledWith("/v2/users/{user_id}", {
      params: {
        path: { user_id: "VXNlcjoxMjM0NQ==" },
      },
      body: {
        name: "Jane Smith Updated",
        is_developer: true,
      },
    });
  });

  it("calls PATCH with only name when isDeveloper is not provided", async () => {
    await updateUser({
      client: mockClient,
      userId: "VXNlcjoxMjM0NQ==",
      name: "New Name",
    });

    expect(patchFn).toHaveBeenCalledWith("/v2/users/{user_id}", {
      params: {
        path: { user_id: "VXNlcjoxMjM0NQ==" },
      },
      body: {
        name: "New Name",
        is_developer: undefined,
      },
    });
  });

  it("transforms response data correctly", async () => {
    const user = await updateUser({
      client: mockClient,
      userId: "VXNlcjoxMjM0NQ==",
      name: "Jane Smith Updated",
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
    patchFn.mockResolvedValue({
      error: { detail: "user not found", title: "Not Found" },
    });

    await expect(
      updateUser({
        client: mockClient,
        userId: "bad-id",
        name: "x",
      }),
    ).rejects.toThrow("user not found");
  });
});
