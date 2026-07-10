import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type RevokeApiKeyParams = WithClient<{
  apiKeyId: string;
}>;

/**
 * Revoke an API key by its ID.
 *
 * Sets the key's status to `revoked` and deactivates it immediately. This
 * operation is irreversible; revoking an already-revoked key is a no-op and
 * still succeeds.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param apiKeyId - The ID of the API key to revoke.
 * @returns void.
 * @throws Error if the API key cannot be revoked or the response is invalid.
 * @example
 * ```typescript
 * import { revokeApiKey } from "@arizeai/ax-client"
 *
 * await revokeApiKey({ apiKeyId: "your_api_key_id" });
 * ```
 */
export async function revokeApiKey({
  client: clientInstance,
  apiKeyId,
}: RevokeApiKeyParams): Promise<void> {
  warnPreRelease({ functionName: "revokeApiKey", stage: "beta" });
  const client = clientInstance ?? createClient();
  const response = await client.PUT("/v2/api-keys/{api_key_id}/revoke", {
    params: {
      path: {
        api_key_id: apiKeyId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
