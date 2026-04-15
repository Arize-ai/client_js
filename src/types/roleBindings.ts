import type { RawRoleBindingResourceType } from "./internal";

export type RoleBindingResourceType = RawRoleBindingResourceType;

export type RoleBinding = {
  id: string;
  roleId: string;
  userId: string;
  resourceType: RoleBindingResourceType;
  resourceId: string;
  createdAt: Date;
  updatedAt: Date;
};
