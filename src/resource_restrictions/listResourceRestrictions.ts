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
    resourceType?: ResourceRestrictionResourceType;
  }
>;

/**
 * List active resource restrictions the authenticated user is permitted to manage.
 *
 * Only restrictions the caller can manage (space admins or users with the
 * `PROJECT_RESTRICT` permission) are returned. Currently only `PROJECT`
 * resources are supported.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param resourceType - An optional filter to return only restrictions of a single resource type.
 * @param limit - An optional limit on the number of restrictions to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link ResourceRestriction} objects.
 * @throws Error if the restrictions cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listResourceRestrictions } from "@arizeai/ax-client"
 *
 * const restrictions = await listResourceRestrictions();
 * console.log(restrictions);
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
