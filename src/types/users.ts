import { components } from "../__generated__/api/v2";

export type UserAccountRole = components["schemas"]["UserRole"];
export type UserStatus = components["schemas"]["UserStatus"];
export type InviteMode = components["schemas"]["InviteMode"];

export type PredefinedUserRole = {
  type: "PREDEFINED";
  name: UserAccountRole;
};

export type CustomUserRole = {
  type: "CUSTOM";
  id: string;
  name?: string;
};

/** Account-level role assignment — either a predefined role or a custom RBAC role. */
export type UserRoleAssignment = PredefinedUserRole | CustomUserRole;

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRoleAssignment;
  createdAt: Date;
  status: UserStatus;
  isDeveloper: boolean;
};

export type UserInviteBasic = {
  inviteMode: "NONE" | "EMAIL_LINK";
};

export type UserInviteTemporaryPassword = {
  inviteMode: "TEMPORARY_PASSWORD";
  temporaryPassword: string;
};

/** Created user — discriminated union on inviteMode. */
export type UserCreated =
  | (User & UserInviteBasic)
  | (User & UserInviteTemporaryPassword);

export type BulkUserDeletionStatus = "deleted" | "failed" | "not_found";

export type BulkUserDeletionSuccess = {
  userId: string;
  email?: string;
  status: "deleted";
};

export type BulkUserDeletionError = {
  userId: string;
  email?: string;
  status: "failed" | "not_found";
  error: string;
};

/** Discriminated union on `status` — check `status` before accessing `error`. */
export type BulkUserDeletionResult =
  | BulkUserDeletionSuccess
  | BulkUserDeletionError;
