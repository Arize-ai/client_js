import { beforeEach, describe, expect, it, vi } from "vitest";
import { createUser } from "../createUser";
import { mockRawUser, mockRawUserCreated } from "./fixtures";

describe("createUser", () => {
  const postFn = vi.fn();

  const mockClient = {
    POST: postFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    postFn.mockReset();
    postFn.mockResolvedValue({
      error: undefined,
      data: mockRawUserCreated,
    });
  });

  it("calls POST /v2/users with correct body", async () => {
    await createUser({
      client: mockClient,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: { type: "PREDEFINED", name: "MEMBER" },
      inviteMode: "EMAIL_LINK",
    });

    expect(postFn).toHaveBeenCalledTimes(1);
    expect(postFn).toHaveBeenCalledWith("/v2/users", {
      body: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: { type: "PREDEFINED", name: "MEMBER" },
        invite_mode: "EMAIL_LINK",
      },
    });
  });

  it("transforms response data correctly", async () => {
    const user = await createUser({
      client: mockClient,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: { type: "PREDEFINED", name: "MEMBER" },
      inviteMode: "EMAIL_LINK",
    });

    expect(user).toEqual({
      id: mockRawUserCreated.id,
      name: mockRawUserCreated.name,
      email: mockRawUserCreated.email,
      role: mockRawUserCreated.role,
      status: mockRawUserCreated.status,
      createdAt: new Date(mockRawUserCreated.created_at),
      isDeveloper: mockRawUserCreated.is_developer,
      inviteMode: mockRawUserCreated.invite_mode,
      temporaryPassword: undefined,
    });
  });

  it("passes is_developer when isDeveloper is provided", async () => {
    await createUser({
      client: mockClient,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: { type: "PREDEFINED", name: "ANNOTATOR" },
      inviteMode: "EMAIL_LINK",
      isDeveloper: true,
    });

    expect(postFn).toHaveBeenCalledWith("/v2/users", {
      body: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: { type: "PREDEFINED", name: "ANNOTATOR" },
        invite_mode: "EMAIL_LINK",
        is_developer: true,
      },
    });
  });

  it("omits is_developer when isDeveloper is not provided", async () => {
    await createUser({
      client: mockClient,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: { type: "PREDEFINED", name: "MEMBER" },
      inviteMode: "EMAIL_LINK",
    });

    const body = postFn.mock.calls[0]?.[1]?.body as Record<string, unknown>;
    expect(body).not.toHaveProperty("is_developer");
  });

  it("returns a User (without inviteMode) when API returns 200 (existing invitation)", async () => {
    postFn.mockResolvedValue({
      error: undefined,
      data: mockRawUser,
    });

    const user = await createUser({
      client: mockClient,
      name: mockRawUser.name,
      email: mockRawUser.email,
      role: { type: "PREDEFINED", name: "MEMBER" },
      inviteMode: "EMAIL_LINK",
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
    expect(user).not.toHaveProperty("inviteMode");
  });

  it("throws when API returns error", async () => {
    postFn.mockResolvedValue({
      error: { detail: "email already exists", title: "Conflict" },
    });

    await expect(
      createUser({
        client: mockClient,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: { type: "PREDEFINED", name: "MEMBER" },
        inviteMode: "EMAIL_LINK",
      }),
    ).rejects.toThrow("email already exists");
  });
});
