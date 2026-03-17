import { createClient } from "../client";
import {
  ApiKey,
  ApiKeyStatus,
  KeyType,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformApiKey } from "./utils";

export type ListApiKeysParams = WithClient<
  PaginationParams & {
    keyType?: KeyType;
    status?: ApiKeyStatus;
  }
>;

/**
 * List API keys accessible to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param keyType - Optional filter by key type: "user" or "service".
 * @param status - Optional filter by key status. Defaults to "active".
 * @param limit - Maximum number of results to return (1-100).
 * @param cursor - Pagination cursor from a previous response.
 * @returns A paginated list of {@link ApiKey} objects.
 * @throws Error if the API keys cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listApiKeys } from "@arizeai/ax-client"
 *
 * const { data } = await listApiKeys();
 * console.log(data.map(k => k.name));
 * ```
 */
export async function listApiKeys(
  params: ListApiKeysParams = {},
): Promise<PaginatedResponse<ApiKey>> {
  warnPreRelease({ functionName: "listApiKeys" });
  const { client: clientInstance, keyType, status, limit, cursor } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/api-keys", {
    params: {
      query: {
        key_type: keyType,
        status,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.api_keys.map(transformApiKey),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
