import { beforeEach, describe, expect, it, vi } from "vitest";
import { addSpaceUser } from "../addSpaceUser";
import { mockRawSpaceMembership } from "./fixtures";

describe("addSpaceUser", () => {
  const postFn = vi.fn();

  const mockClient = {
    POST: postFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    postFn.mockReset();
    postFn.mockResolvedValue({
      error: undefined,
      data: mockRawSpaceMembership,
    });
  });

  it("calls POST /v2/spaces/{space_id}/users with correct params and body", async () => {
    await addSpaceUser({
      client: mockClient,
      spaceId: "U3BhY2U6YWJjMTIz",
      userId: "VXNlcjoxMjM0NQ==",
      role: { type: "predefined", name: "member" },
    });

    expect(postFn).toHaveBeenCalledTimes(1);
    expect(postFn).toHaveBeenCalledWith("/v2/spaces/{space_id}/users", {
      params: { path: { space_id: "U3BhY2U6YWJjMTIz" } },
      body: {
        user_id: "VXNlcjoxMjM0NQ==",
        role: { type: "predefined", name: "member" },
      },
    });
  });

  it("supports custom role assignment", async () => {
    await addSpaceUser({
      client: mockClient,
      spaceId: "U3BhY2U6YWJjMTIz",
      userId: "VXNlcjoxMjM0NQ==",
      role: { type: "custom", id: "role_xyz" },
    });

    expect(postFn).toHaveBeenCalledWith("/v2/spaces/{space_id}/users", {
      params: { path: { space_id: "U3BhY2U6YWJjMTIz" } },
      body: {
        user_id: "VXNlcjoxMjM0NQ==",
        role: { type: "custom", id: "role_xyz" },
      },
    });
  });

  it("transforms response data correctly", async () => {
    const membership = await addSpaceUser({
      client: mockClient,
      spaceId: "U3BhY2U6YWJjMTIz",
      userId: "VXNlcjoxMjM0NQ==",
      role: { type: "predefined", name: "member" },
    });

    expect(membership).toEqual({
      id: mockRawSpaceMembership.id,
      userId: mockRawSpaceMembership.user_id,
      spaceId: mockRawSpaceMembership.space_id,
      role: { type: "predefined", name: "member" },
    });
  });

  it("throws when API returns error", async () => {
    postFn.mockResolvedValue({
      error: { detail: "user not found", title: "Not Found" },
    });

    await expect(
      addSpaceUser({
        client: mockClient,
        spaceId: "U3BhY2U6YWJjMTIz",
        userId: "VXNlcjoxMjM0NQ==",
        role: { type: "predefined", name: "member" },
      }),
    ).rejects.toThrow("user not found");
  });
});
