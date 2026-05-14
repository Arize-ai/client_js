import { createClient } from "../client";
import { User, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformUser } from "./utils";

export type UpdateUserParams = WithClient<{
  /** The unique identifier of the user. */
  userId: string;
  /** Updated display name for the user. */
  name?: string;
  /** Set to true to grant developer permissions, or false to revoke them. */
  isDeveloper?: boolean;
}>;

/**
 * Update a user's display name and/or developer permission.
 *
 * At least one of `name` or `isDeveloper` must be provided. `name` is stripped of
 * leading/trailing whitespace before validation — whitespace-only values are rejected.
 * Setting `isDeveloper` to its current value is a no-op (idempotent).
 *
 * Requires account admin role or USER_UPDATE permission.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param userId - The unique identifier of the user.
 * @param name - An optional updated display name.
 * @param isDeveloper - An optional boolean to grant or revoke developer permissions.
 * @returns The updated {@link User} object.
 * @throws Error if the user cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateUser } from "@arizeai/ax-client"
 *
 * const user = await updateUser({
 *   userId: "VXNlcjoxMjM0NQ==",
 *   name: "Jane Smith Updated",
 *   isDeveloper: true,
 * });
 * console.log(user);
 * ```
 */
export async function updateUser({
  client: clientInstance,
  userId,
  name,
  isDeveloper,
}: UpdateUserParams): Promise<User> {
  warnPreRelease({ functionName: "updateUser" });
  const client = clientInstance ?? createClient();
  const response = await client.PATCH("/v2/users/{user_id}", {
    params: {
      path: { user_id: userId },
    },
    body: {
      name,
      is_developer: isDeveloper,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformUser(response.data);
}
