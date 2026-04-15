import { RoleBinding } from "../types";
import { RawRoleBinding } from "../types/internal";

export function transformRoleBinding(binding: RawRoleBinding): RoleBinding {
  const {
    role_id,
    user_id,
    resource_type,
    resource_id,
    created_at,
    updated_at,
    ...rest
  } = binding;
  return {
    ...rest,
    roleId: role_id,
    userId: user_id,
    resourceType: resource_type,
    resourceId: resource_id,
    createdAt: new Date(created_at),
    updatedAt: new Date(updated_at),
  };
}
