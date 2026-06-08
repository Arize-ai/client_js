import { createClient } from "../client";
import {
  User,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { UserStatus } from "../types/users";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformUser } from "./utils";

export type ListUsersParams = WithClient<
  PaginationParams & {
    /** Optional case-insensitive partial match filter on email address. */
    email?: string;
    /** Optional filter by user status. Can specify multiple statuses. */
    status?: UserStatus[];
  }
>;

/**
 * List users in the account. Results are sorted by creation date ascending (oldest first).
 *
 * Requires account admin role, member role, or USER_READ permission.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param email - An optional case-insensitive partial match filter on email.
 * @param status - An optional array of user statuses to filter by.
 * @param limit - An optional limit on the number of users to return (max 100).
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link User} objects.
 * @throws Error if the users cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listUsers } from "@arizeai/ax-client"
 *
 * const result = await listUsers();
 * console.log(result.data);
 * ```
 */
export async function listUsers(
  params: ListUsersParams = {},
): Promise<PaginatedResponse<User>> {
  warnPreRelease({ functionName: "listUsers", stage: "beta" });
  const {
    client: clientInstance,
    email,
    status,
    limit = DEFAULT_LIST_LIMIT,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/users", {
    params: {
      query: {
        email,
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
    data: response.data.users.map(transformUser),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
