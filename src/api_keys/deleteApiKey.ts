import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type DeleteApiKeyParams = WithClient<{
  apiKeyId: string;
}>;

/**
 * Delete an API key by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param apiKeyId - The ID of the API key to delete.
 * @returns void.
 * @throws Error if the API key cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteApiKey } from "@arizeai/ax-client"
 *
 * await deleteApiKey({ apiKeyId: "your_api_key_id" });
 * ```
 */
export async function deleteApiKey({
  client: clientInstance,
  apiKeyId,
}: DeleteApiKeyParams): Promise<void> {
  warnPreRelease({ functionName: "deleteApiKey", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE("/v2/api-keys/{api_key_id}", {
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
