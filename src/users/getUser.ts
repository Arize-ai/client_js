import { createClient } from "../client";
import { User, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformUser } from "./utils";

export type GetUserParams = WithClient<{
  /** The unique identifier of the user. */
  userId: string;
}>;

/**
 * Get a user by their ID.
 *
 * Returns 404 if the user does not exist, does not belong to the caller's account,
 * or the caller lacks read permission.
 *
 * Requires account admin role, member role, or USER_READ permission.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param userId - The unique identifier of the user.
 * @returns A {@link User} object.
 * @throws Error if the user cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getUser } from "@arizeai/ax-client"
 *
 * const user = await getUser({ userId: "VXNlcjoxMjM0NQ==" });
 * console.log(user);
 * ```
 */
export async function getUser({
  client: clientInstance,
  userId,
}: GetUserParams): Promise<User> {
  warnPreRelease({ functionName: "getUser", stage: "beta" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/users/{user_id}", {
    params: {
      path: { user_id: userId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformUser(response.data);
}
