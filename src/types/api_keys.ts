import { components } from "../__generated__/api/v2";

export type KeyType = components["schemas"]["ApiKeyType"];
export type ApiKeyStatus = components["schemas"]["ApiKeyStatus"];
// TS's built-in Omit<T, K> does not distribute over union types, so
// Omit<A | B, "type"> collapses the union instead of stripping "type" from each member.
// This distributive variant applies Omit to each union branch independently,
// preserving the discriminated union shape while hiding the internal "type" discriminator.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

/**
 * Space role assignment for a service key's bot user: predefined
 * (`{ name: "ADMIN" | "MEMBER" | "READ_ONLY" }`) or custom
 * (`{ id: "<encoded-role-id>" }`).
 */
export type ApiKeySpaceRoleAssignment = DistributiveOmit<
  components["schemas"]["SpaceRoleAssignment"],
  "type"
>;

/**
 * Org role assignment for a service key's bot user: predefined
 * (`{ name: "ADMIN" | "MEMBER" | "READ_ONLY" }`) or custom
 * (`{ id: "<encoded-role-id>" }`).
 */
export type ApiKeyOrgRoleAssignment = DistributiveOmit<
  components["schemas"]["OrganizationRoleAssignment"],
  "type"
>;

/**
 * Account role assignment for a service key's bot user: predefined
 * (`{ name: "ADMIN" | "MEMBER" }`) or custom (`{ id: "<encoded-role-id>" }`).
 */
export type ApiKeyAccountRoleAssignment = DistributiveOmit<
  components["schemas"]["UserRoleAssignment"],
  "type"
>;

/**
 * Declares one space that the service key's bot user should access.
 *
 * The **binding** (`spaceId`) answers "which space?". The **role assignment** (`role`)
 * answers "with what role?" — either a predefined role (`{ name: "ADMIN" | "MEMBER" | "READ_ONLY" }`)
 * or a custom RBAC role by ID (`{ id: "<encoded-role-id>" }`).
 */
export type SpaceBinding = {
  /** The ID of the space to bind the bot user to. */
  spaceId: string;
  /**
   * Role to assign the bot user within this space. Predefined: `{ name: "ADMIN" | "MEMBER" | "READ_ONLY" }`.
   * Custom RBAC: `{ id: "<encoded-role-id>" }`. When omitted, the server applies the
   * default predefined `MEMBER` role.
   */
  role?: ApiKeySpaceRoleAssignment;
};

/**
 * Declares one organization that the service key's bot user should access,
 * together with the spaces within that organization.
 *
 * The **binding** (`orgId`) answers "which organization?". The **role assignment** (`role`)
 * answers "with what org-level role?". `spaces` carries the per-space bindings nested under this org.
 */
export type OrgBinding = {
  /** The HMAC-encoded ID of the organization. */
  orgId: string;
  /**
   * Role to assign the bot user within this organization. Predefined: `{ name: "ADMIN" | "MEMBER" | "READ_ONLY" }`.
   * Custom RBAC: `{ id: "<encoded-role-id>" }`. When omitted, the server applies the
   * default predefined `READ_ONLY` role.
   */
  role?: ApiKeyOrgRoleAssignment;
  /** Space bindings within this organization. At least one entry is required. */
  spaces: [SpaceBinding, ...SpaceBinding[]];
};

export type ApiKey = {
  id: string;
  name: string;
  description?: string;
  keyType: KeyType;
  status: ApiKeyStatus;
  redactedKey: string;
  createdAt: Date;
  expiresAt?: Date;
  createdByUserId: string;
  lastUsedAt?: Date;
};

/**
 * A space binding on the bot user returned in a service key creation response.
 * Unlike the request input, `role` is always present (defaults are resolved server-side).
 */
export type ServiceKeyBotUserSpaceBinding = {
  spaceId: string;
  role: ApiKeySpaceRoleAssignment;
};

/**
 * An organization binding on the bot user returned in a service key creation response.
 * Unlike the request input, `role` is always present (defaults are resolved server-side).
 */
export type ServiceKeyBotUserOrgBinding = {
  orgId: string;
  role: ApiKeyOrgRoleAssignment;
  spaces: ServiceKeyBotUserSpaceBinding[];
};

/**
 * Bot user created for a service API key, as returned in the creation response.
 */
export type ServiceKeyBotUser = {
  id: string;
  name: string;
  accountRole: ApiKeyAccountRoleAssignment;
  organizations: ServiceKeyBotUserOrgBinding[];
};

/**
 * Returned only from createApiKey and refreshApiKey.
 * The `key` field contains the full API key value and is **only returned once**.
 * Store it securely — it cannot be retrieved again.
 *
 * For service keys, `botUser` contains the bot user's resolved role assignments.
 */
export type ApiKeyCreated = ApiKey & {
  key: string;
  botUser?: ServiceKeyBotUser;
};

/**
 * Returned from refreshApiKey. Refresh returns a replacement credential and
 * its metadata, but does not include service-account bindings.
 */
export type ApiKeyRefreshed = ApiKey & {
  key: string;
};
