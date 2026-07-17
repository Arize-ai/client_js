import { createClient } from "../client";
import { ApiKey, ApiKeyRoles, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformApiKey } from "./utils";

export type CreateApiKeyParams = WithClient<{
  name: string;
  description?: string;
  keyType?: "USER" | "SERVICE";
  expiresAt?: Date | string;
  spaceId?: string;
  roles?: ApiKeyRoles;
}>;

/**
 * Create a new API key.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the API key.
 * @param description - An optional description for the API key.
 * @param keyType - The type of key: "USER" (default) or "SERVICE". Service keys require `spaceId`.
 * @param expiresAt - Optional expiration date. If omitted, the key never expires.
 * @param spaceId - Required for service keys. The ID of the space the key is scoped to.
 * @param roles - Optional role assignments for service keys.
 * @returns A {@link ApiKey} containing the full key value. **Store the `key` field securely — it is only returned once.**
 * @throws Error if the API key cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createApiKey } from "@arizeai/ax-client"
 *
 * const apiKey = await createApiKey({ name: "CI pipeline key" });
 * console.log(apiKey.key); // Store this securely — returned only once
 * ```
 */
export async function createApiKey({
  client: clientInstance,
  name,
  description,
  keyType,
  expiresAt,
  spaceId,
  roles,
}: CreateApiKeyParams): Promise<ApiKey> {
  warnPreRelease({ functionName: "createApiKey", stage: "beta" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/api-keys", {
    body: {
      name,
      description,
      key_type: keyType,
      expires_at:
        expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt,
      space_id: spaceId,
      roles: roles
        ? {
            space_role: roles.spaceRole,
            org_role: roles.orgRole,
            account_role: roles.accountRole,
          }
        : undefined,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformApiKey(response.data);
}
