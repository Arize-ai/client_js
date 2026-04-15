import { ResourceRestriction } from "../types";
import { RawResourceRestriction } from "../types/internal";

export function transformResourceRestriction(
  restriction: RawResourceRestriction,
): ResourceRestriction {
  const { resource_type, resource_id, created_at } = restriction;
  return {
    resourceType: resource_type,
    resourceId: resource_id,
    createdAt: new Date(created_at),
  };
}
