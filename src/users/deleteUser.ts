import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type DeleteUserParams = WithClient<{
  /** The unique identifier of the user to delete. */
  userId: string;
}>;

/**
 * Permanently block a user from the account.
 *
 * Sets the user's status to `inactive` — a terminal state. Cascades to organization
 * memberships, space memberships, API keys, and role bindings. Blocked users cannot
 * be re-invited. Callers cannot delete themselves. Blocking an already-inactive user
 * is idempotent.
 *
 * Requires account admin role or USER_DELETE permission.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param userId - The unique identifier of the user to delete.
 * @returns void.
 * @throws Error if the user cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteUser } from "@arizeai/ax-client"
 *
 * await deleteUser({ userId: "VXNlcjoxMjM0NQ==" });
 * ```
 */
export async function deleteUser({
  client: clientInstance,
  userId,
}: DeleteUserParams): Promise<void> {
  warnPreRelease({ functionName: "deleteUser", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE("/v2/users/{user_id}", {
    params: {
      path: { user_id: userId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
