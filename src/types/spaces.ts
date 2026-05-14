export type Space = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
};

export type UserSpaceRole = "admin" | "member" | "read-only" | "annotator";

export type PredefinedSpaceRole = {
  type: "predefined";
  name: UserSpaceRole;
};

export type CustomSpaceRole = {
  type: "custom";
  id: string;
  name?: string;
};

/** Space-level role assignment — either a predefined role or a custom RBAC role. */
export type SpaceRoleAssignment = PredefinedSpaceRole | CustomSpaceRole;

export type SpaceMembership = {
  id: string;
  userId: string;
  spaceId: string;
  role: SpaceRoleAssignment;
};
