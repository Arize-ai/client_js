export type Organization = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
};

export type OrganizationRole = "admin" | "member" | "read-only" | "annotator";

export type PredefinedOrganizationRole = {
  type: "predefined";
  name: OrganizationRole;
};

export type CustomOrganizationRole = {
  type: "custom";
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
