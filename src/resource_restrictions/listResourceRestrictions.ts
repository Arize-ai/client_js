import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  ResourceRestriction,
  ResourceRestrictionResourceType,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformResourceRestriction } from "./utils";

export type ListResourceRestrictionsParams = WithClient<
  PaginationParams & {
    /** Optional filter. When omitted, restrictions of all supported types (PROJECT and DASHBOARD) are returned. */
    resourceType?: ResourceRestrictionResourceType;
  }
>;

/**
 * List active resource restrictions the authenticated user is permitted to manage.
 *
 * Only restrictions the caller can manage (space admins or users with the
 * appropriate resource restriction permission) are returned.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param resourceType - Optional filter. When omitted, restrictions of all supported
 *   types (PROJECT and DASHBOARD) are returned in one merged list.
 * @param limit - An optional limit on the number of restrictions to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link ResourceRestriction} objects.
 * @throws Error if the restrictions cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listResourceRestrictions } from "@arizeai/ax-client"
 *
 * // Return all restricted resources (all types):
 * const all = await listResourceRestrictions({});
 *
 * // Return only restricted projects:
 * const projects = await listResourceRestrictions({ resourceType: "PROJECT" });
 * console.log(all, projects);
 * ```
 */
export async function listResourceRestrictions(
  params: ListResourceRestrictionsParams = {},
): Promise<PaginatedResponse<ResourceRestriction>> {
  warnPreRelease({ functionName: "listResourceRestrictions", stage: "beta" });
  const {
    client: clientInstance,
    resourceType,
    limit = DEFAULT_LIST_LIMIT,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/resource-restrictions", {
    params: {
      query: {
        resource_type: resourceType,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.resource_restrictions.map(transformResourceRestriction),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
