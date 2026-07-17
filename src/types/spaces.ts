import { components } from "../__generated__/api/v2";

export type Space = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
};

export type UserSpaceRole = components["schemas"]["UserSpaceRole"];

export type PredefinedSpaceRole = {
  type: "PREDEFINED";
  name: UserSpaceRole;
};

export type CustomSpaceRole = {
  type: "CUSTOM";
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
