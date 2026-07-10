import type { RawResourceRestrictionType } from "./internal";

export type ResourceRestrictionResourceType = RawResourceRestrictionType;

export type ResourceRestriction = {
  resourceType: ResourceRestrictionResourceType;
  resourceId: string;
  createdAt: Date;
};
