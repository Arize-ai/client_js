import { Space, SpaceMembership, SpaceRoleAssignment } from "../types";
import { RawSpace, RawSpaceMembership } from "../types/internal";
import { components } from "../__generated__/api/v2";

export function transformSpace(space: RawSpace): Space {
  const { created_at, ...rest } = space;
  return {
    ...rest,
    createdAt: new Date(created_at),
  };
}

function transformSpaceRoleAssignment(
  raw: components["schemas"]["SpaceRoleAssignment"],
): SpaceRoleAssignment {
  if (raw.type === "predefined") {
    return { type: "predefined", name: raw.name };
  }
  return { type: "custom", id: raw.id, name: raw.name };
}

export function transformSpaceMembership(
  membership: RawSpaceMembership,
): SpaceMembership {
  return {
    id: membership.id,
    userId: membership.user_id,
    spaceId: membership.space_id,
    role: transformSpaceRoleAssignment(membership.role),
  };
}
