import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  Space,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformSpace } from "./utils";

export type ListSpacesParams = WithClient<
  PaginationParams & {
    organizationId?: string;
    /** Case-insensitive substring filter on the space name. */
    name?: string;
  }
>;

/**
 * List the information about all spaces available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param organizationId - An optional organization ID used to filter spaces in a specific organization.
 * @param name - An optional case-insensitive substring filter on the space name.
 * @param limit - An optional limit on the number of spaces to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link Space} objects.
 * @throws Error if the spaces cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listSpaces } from "@arizeai/ax-client"
 *
 * const spaces = await listSpaces();
 * console.log(spaces);
 * ```
 */
export async function listSpaces(
  params: ListSpacesParams = {},
): Promise<PaginatedResponse<Space>> {
  warnPreRelease({ functionName: "listSpaces", stage: "beta" });
  const {
    client: clientInstance,
    organizationId,
    name,
    limit,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/spaces", {
    params: {
      query: {
        org_id: organizationId,
        name,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.spaces.map(transformSpace),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
