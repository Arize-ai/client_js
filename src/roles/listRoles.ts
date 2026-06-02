import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  Role,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformRole } from "./utils";

export type ListRolesParams = WithClient<
  PaginationParams & {
    isPredefined?: boolean;
  }
>;

/**
 * List roles for the authenticated user's account.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param isPredefined - An optional filter to return only predefined or only custom roles.
 * @param limit - An optional limit on the number of roles to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link Role} objects.
 * @throws Error if the roles cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listRoles } from "@arizeai/ax-client"
 *
 * const roles = await listRoles();
 * console.log(roles);
 * ```
 */
export async function listRoles(
  params: ListRolesParams = {},
): Promise<PaginatedResponse<Role>> {
  warnPreRelease({ functionName: "listRoles", stage: "beta" });
  const {
    client: clientInstance,
    isPredefined,
    limit = DEFAULT_LIST_LIMIT,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/roles", {
    params: {
      query: {
        is_predefined: isPredefined,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.roles.map(transformRole),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
