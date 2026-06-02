import { beforeEach, describe, expect, it, vi } from "vitest";
import { listUsers } from "../listUsers";
import { mockRawUser } from "./fixtures";

describe("listUsers", () => {
  const getFn = vi.fn();

  const mockClient = {
    GET: getFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    getFn.mockReset();
    getFn.mockResolvedValue({
      error: undefined,
      data: {
        users: [mockRawUser],
        pagination: {
          next_cursor: "cursor_abc",
          has_more: true,
        },
      },
    });
  });

  it("calls GET /v2/users with query params", async () => {
    await listUsers({
      client: mockClient,
      email: "jane@example.com",
      status: ["active", "invited"],
      limit: 50,
      cursor: "cursor_123",
    });

    expect(getFn).toHaveBeenCalledTimes(1);
    expect(getFn).toHaveBeenCalledWith("/v2/users", {
      params: {
        query: {
          email: "jane@example.com",
          status: ["active", "invited"],
          limit: 50,
          cursor: "cursor_123",
        },
      },
    });
  });

  it("defaults limit to 50 when no params provided", async () => {
    await listUsers({ client: mockClient });

    expect(getFn).toHaveBeenCalledWith("/v2/users", {
      params: {
        query: {
          email: undefined,
          status: undefined,
          limit: 50,
          cursor: undefined,
        },
      },
    });
  });

  it("transforms response data correctly", async () => {
    const result = await listUsers({ client: mockClient });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toEqual({
      id: mockRawUser.id,
      name: mockRawUser.name,
      email: mockRawUser.email,
      role: mockRawUser.role,
      status: mockRawUser.status,
      createdAt: new Date(mockRawUser.created_at),
      isDeveloper: mockRawUser.is_developer,
    });
    expect(result.pagination).toEqual({
      nextCursor: "cursor_abc",
      hasMore: true,
    });
  });

  it("throws when API returns error", async () => {
    getFn.mockResolvedValue({
      error: { detail: "forbidden", title: "Forbidden" },
    });

    await expect(listUsers({ client: mockClient })).rejects.toThrow(
      "forbidden",
    );
  });
});
