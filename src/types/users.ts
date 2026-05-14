export type UserAccountRole = "admin" | "member" | "annotator";
export type UserStatus = "active" | "invited" | "expired";
export type InviteMode = "none" | "email_link" | "temporary_password";

export type PredefinedUserRole = {
  type: "predefined";
  name: UserAccountRole;
};

export type CustomUserRole = {
  type: "custom";
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
  inviteMode: "none" | "email_link";
};

export type UserInviteTemporaryPassword = {
  inviteMode: "temporary_password";
  temporaryPassword: string;
};

/** Created user — discriminated union on inviteMode. */
export type UserCreated =
  | (User & UserInviteBasic)
  | (User & UserInviteTemporaryPassword);
