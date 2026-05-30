import { createClient } from "../client";
import { ApiKeyCreated, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformApiKeyCreated } from "./utils";

export type RefreshApiKeyParams = WithClient<{
  apiKeyId: string;
  expiresAt?: Date | string;
}>;

/**
 * Refresh an API key.
 *
 * Atomically revokes the existing key and issues a replacement with the same
 * metadata (name, description, and key type). There is no window where neither
 * key is valid.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param apiKeyId - The ID of the API key to refresh.
 * @param expiresAt - Optional expiration date for the replacement key. If omitted, the key never expires.
 * @returns A {@link ApiKeyCreated} containing the full new key value. **Store the `key` field securely — it is only returned once.**
 * @throws Error if the API key cannot be refreshed or the response is invalid.
 * @example
 * ```typescript
 * import { refreshApiKey } from "@arizeai/ax-client"
 *
 * const refreshed = await refreshApiKey({ apiKeyId: "your-api-key-id" });
 * console.log(refreshed.key); // Store this securely — returned only once
 * ```
 */
export async function refreshApiKey({
  client: clientInstance,
  apiKeyId,
  expiresAt,
}: RefreshApiKeyParams): Promise<ApiKeyCreated> {
  warnPreRelease({ functionName: "refreshApiKey", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/api-keys/{api_key_id}/refresh", {
    params: { path: { api_key_id: apiKeyId } },
    body: {
      expires_at:
        expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformApiKeyCreated(response.data);
}
