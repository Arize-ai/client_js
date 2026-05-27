import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  RoleBinding,
  RoleBindingResourceType,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformRoleBinding } from "./utils";

export type ListRoleBindingsParams = WithClient<
  PaginationParams & {
    userId?: string;
    resourceType: RoleBindingResourceType;
  }
>;

/**
 * List role bindings for the authenticated user's account.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param resourceType - The {@link RoleBindingResourceType | ResourceType} to list bindings for.
 * @param userId - An optional user ID to filter bindings for a specific user.
 * @param limit - An optional limit on the number of role bindings to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link RoleBinding} objects.
 * @throws Error if the role bindings cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listRoleBindings } from "@arizeai/ax-client"
 *
 * const bindings = await listRoleBindings({ resourceType: "SPACE" });
 * console.log(bindings);
 * ```
 */
export async function listRoleBindings(
  params: ListRoleBindingsParams,
): Promise<PaginatedResponse<RoleBinding>> {
  warnPreRelease({ functionName: "listRoleBindings" });
  const {
    client: clientInstance,
    userId,
    resourceType,
    limit,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/role-bindings", {
    params: {
      query: {
        user_id: userId,
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
    data: response.data.role_bindings.map(transformRoleBinding),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
