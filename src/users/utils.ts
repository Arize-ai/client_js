import { User, UserCreated } from "../types";
import { RawUser, RawCreateUserResponse } from "../types/internal";

export function transformUser(user: RawUser): User {
  const { created_at, is_developer, ...rest } = user;
  return {
    ...rest,
    createdAt: new Date(created_at),
    isDeveloper: is_developer,
  };
}

export function transformUserCreated(user: RawCreateUserResponse): UserCreated {
  const { created_at, is_developer, invite_mode, temporary_password, ...rest } =
    user;
  const base = {
    ...rest,
    createdAt: new Date(created_at),
    isDeveloper: is_developer,
  };
  if (invite_mode === "TEMPORARY_PASSWORD") {
    return {
      ...base,
      inviteMode: invite_mode,
      temporaryPassword: temporary_password as string,
    };
  }
  return { ...base, inviteMode: invite_mode };
}
