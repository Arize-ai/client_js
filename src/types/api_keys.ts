export type KeyType = "user" | "service";
export type ApiKeyStatus = "active" | "deleted";

export type ApiKeyRoles = {
  spaceRole?: "admin" | "member" | "read-only";
  orgRole?: "admin" | "member" | "read-only";
  accountRole?: "admin" | "member";
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
};

/**
 * Returned only from createApiKey and refreshApiKey.
 * The `key` field contains the full API key value and is **only returned once**.
 * Store it securely — it cannot be retrieved again.
 */
export type ApiKeyCreated = ApiKey & {
  key: string;
};
