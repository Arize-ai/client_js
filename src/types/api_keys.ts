import { components } from "../__generated__/api/v2";

export type KeyType = components["schemas"]["ApiKeyType"];
export type ApiKeyStatus = components["schemas"]["ApiKeyStatus"];

export type ApiKeyRoles = {
  spaceRole?: components["schemas"]["ApiKeySpaceRole"];
  orgRole?: components["schemas"]["ApiKeyOrganizationRole"];
  accountRole?: components["schemas"]["ApiKeyAccountRole"];
};

/**
 * An API key as returned in list results. Carries the redacted (masked) key for
 * display; the raw secret is never returned.
 */
export type ApiKeyRedacted = {
  id: string;
  name: string;
  description?: string;
  keyType: KeyType;
  status: ApiKeyStatus;
  redactedKey: string;
  createdAt: Date;
  expiresAt?: Date;
  createdByUserId: string;
};

/**
 * A created or refreshed API key. The `key` field contains the full API key value
 * and is **only returned once** — store it securely, it cannot be retrieved again.
 */
export type ApiKey = {
  id: string;
  name: string;
  description?: string;
  keyType: KeyType;
  status: ApiKeyStatus;
  key: string;
  createdAt: Date;
  expiresAt?: Date;
  createdByUserId: string;
};
