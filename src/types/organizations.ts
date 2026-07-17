import { components } from "../__generated__/api/v2";

export type Organization = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
};

export type OrganizationRole = components["schemas"]["OrganizationRole"];

export type PredefinedOrganizationRole = {
  type: "PREDEFINED";
  name: OrganizationRole;
};

export type CustomOrganizationRole = {
  type: "CUSTOM";
  id: string;
  name?: string;
};

/** Organization-level role assignment — either a predefined role or a custom RBAC role. */
export type OrganizationRoleAssignment =
  | PredefinedOrganizationRole
  | CustomOrganizationRole;

export type OrganizationMembership = {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRoleAssignment;
};
