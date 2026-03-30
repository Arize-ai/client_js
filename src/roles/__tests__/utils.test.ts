import { describe, expect, it } from "vitest";
import { transformRole } from "../utils";
import { updateRole } from "../updateRole";
import { mockRole } from "./fixtures";

describe("updateRole", () => {
  it("should throw if no update fields are provided", async () => {
    await expect(updateRole({ roleId: "test-role-id" })).rejects.toThrow(
      "At least one of 'name', 'description', or 'permissions' must be provided",
    );
  });
});

describe("transformRole", () => {
  it("should transform snake_case fields and dates", () => {
    const role = transformRole(mockRole);
    expect(role).toEqual({
      id: mockRole.id,
      name: mockRole.name,
      description: mockRole.description,
      permissions: mockRole.permissions,
      isPredefined: mockRole.is_predefined,
      createdAt: new Date(mockRole.created_at),
      updatedAt: new Date(mockRole.updated_at),
    });
  });
});
