import { Role } from "../types";
import { RawRole } from "../types/internal";

export function transformRole(role: RawRole): Role {
  const { is_predefined, created_at, updated_at, ...rest } = role;
  return {
    ...rest,
    isPredefined: is_predefined,
    createdAt: new Date(created_at),
    updatedAt: new Date(updated_at),
  };
}
