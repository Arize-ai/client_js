import { describe, expect, it } from "vitest";
import { transformRoleBinding } from "../utils";
import { mockRoleBinding } from "./fixtures";

describe("transformRoleBinding", () => {
  it("should transform snake_case fields and dates", () => {
    const binding = transformRoleBinding(mockRoleBinding);
    expect(binding).toEqual({
      id: mockRoleBinding.id,
      roleId: mockRoleBinding.role_id,
      userId: mockRoleBinding.user_id,
      resourceType: mockRoleBinding.resource_type,
      resourceId: mockRoleBinding.resource_id,
      createdAt: new Date(mockRoleBinding.created_at),
      updatedAt: new Date(mockRoleBinding.updated_at),
    });
  });

  it("should convert created_at and updated_at strings to Date instances", () => {
    const binding = transformRoleBinding(mockRoleBinding);
    expect(binding.createdAt).toBeInstanceOf(Date);
    expect(binding.updatedAt).toBeInstanceOf(Date);
  });
});
