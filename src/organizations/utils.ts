import {
  Organization,
  OrganizationMembership,
  OrganizationRoleAssignment,
} from "../types";
import { RawOrganization, RawOrganizationMembership } from "../types/internal";
import { components } from "../__generated__/api/v2";

export function transformOrganization(org: RawOrganization): Organization {
  const { created_at, ...rest } = org;
  return {
    ...rest,
    createdAt: new Date(created_at),
  };
}

function transformOrganizationRoleAssignment(
  raw: components["schemas"]["OrganizationRoleAssignment"],
): OrganizationRoleAssignment {
  if (raw.type === "PREDEFINED") {
    return { type: "PREDEFINED", name: raw.name };
  }
  return { type: "CUSTOM", id: raw.id, name: raw.name };
}

export function transformOrganizationMembership(
  membership: RawOrganizationMembership,
): OrganizationMembership {
  return {
    id: membership.id,
    userId: membership.user_id,
    organizationId: membership.organization_id,
    role: transformOrganizationRoleAssignment(membership.role),
  };
}
