import { User, UserCreated } from "../types";
import { RawUser, RawUserCreatedResponse } from "../types/internal";

export function transformUser(user: RawUser): User {
  const { created_at, is_developer, ...rest } = user;
  return {
    ...rest,
    createdAt: new Date(created_at),
    isDeveloper: is_developer,
  };
}

export function transformUserCreated(
  user: RawUserCreatedResponse,
): UserCreated {
  const { created_at, is_developer, invite_mode, temporary_password, ...rest } =
    user;
  const base = {
    ...rest,
    createdAt: new Date(created_at),
    isDeveloper: is_developer,
  };
  if (invite_mode === "temporary_password") {
    return {
      ...base,
      inviteMode: invite_mode,
      temporaryPassword: temporary_password as string,
    };
  }
  return { ...base, inviteMode: invite_mode };
}
