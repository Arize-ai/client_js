import type { RawRoleBindingResourceType } from "./internal";

export type ResourceRestrictionResourceType = RawRoleBindingResourceType;

export type ResourceRestriction = {
  resourceType: ResourceRestrictionResourceType;
  resourceId: string;
  createdAt: Date;
};
