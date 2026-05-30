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
    /** Space ID to filter service keys. When provided, returns service keys for
     * the given space. Combine with `userId` to filter by creator. */
    spaceId?: string;
    /** Base64 global ID of the user whose keys to return. For service keys
     * (with `spaceId`), available to any caller with space access. For user
     * keys (without `spaceId`), requires account admin role. */
    userId?: string;
  }
>;

/**
 * List API keys accessible to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param keyType - Optional filter by key type: "user" or "service".
 * @param status - Optional filter by key status. Defaults to "active".
 * @param spaceId - Optional space ID. When provided, returns service keys for
 *   that space. Combine with `userId` to filter by creator.
 * @param userId - Optional base64 global ID of the user whose keys to return.
 *   For service keys (with `spaceId`), available to any caller with space
 *   access. For user keys (without `spaceId`), requires account admin role.
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
  warnPreRelease({ functionName: "listApiKeys", stage: "alpha" });
  const {
    client: clientInstance,
    keyType,
    status,
    spaceId,
    userId,
    limit,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/api-keys", {
    params: {
      query: {
        key_type: keyType,
        status,
        space_id: spaceId,
        user_id: userId,
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
