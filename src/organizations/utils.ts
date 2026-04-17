import { Organization } from "../types";
import { RawOrganization } from "../types/internal";

export function transformOrganization(org: RawOrganization): Organization {
  const { created_at, ...rest } = org;
  return {
    ...rest,
    createdAt: new Date(created_at),
  };
}
