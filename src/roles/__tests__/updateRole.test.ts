import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateRole } from "../updateRole";
import { mockRole } from "./fixtures";

describe("updateRole", () => {
  const patch = vi.fn();
  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    patch.mockReset();
    patch.mockResolvedValue({
      error: undefined,
      data: mockRole,
    });
  });

  it("forwards description: null to clear the description", async () => {
    await updateRole({
      client: mockClient,
      roleId: "test-role-id",
      description: null,
    });

    expect(patch).toHaveBeenCalledWith("/v2/roles/{role_id}", {
      params: { path: { role_id: "test-role-id" } },
      body: {
        name: undefined,
        description: null,
        permissions: undefined,
      },
    });
  });

  it("throws if no update fields are provided", async () => {
    await expect(
      updateRole({ client: mockClient, roleId: "test-role-id" }),
    ).rejects.toThrow(
      "At least one of 'name', 'description', or 'permissions' must be provided",
    );

    expect(patch).not.toHaveBeenCalled();
  });
});
