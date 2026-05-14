import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type RemoveSpaceUserParams = WithClient<{
  /** The unique identifier of the space. */
  spaceId: string;
  /** The unique identifier of the user to remove. */
  userId: string;
}>;

/**
 * Remove a user from a space.
 *
 * Removes the user's space membership and all RBAC role bindings on the space.
 * Returns 404 if the user is not a member of the space.
 *
 * Requires space admin role or `ROLE_BINDING_DELETE` permission.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - The unique identifier of the space.
 * @param userId - The unique identifier of the user to remove.
 * @returns void.
 * @throws Error if the user cannot be removed or the response is invalid.
 * @example
 * ```typescript
 * import { removeSpaceUser } from "@arizeai/ax-client"
 *
 * await removeSpaceUser({
 *   spaceId: "U3BhY2U6YWJjMTIz",
 *   userId: "VXNlcjoxMjM0NQ==",
 * });
 * ```
 */
export async function removeSpaceUser({
  client: clientInstance,
  spaceId,
  userId,
}: RemoveSpaceUserParams): Promise<void> {
  warnPreRelease({ functionName: "removeSpaceUser" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE(
    "/v2/spaces/{space_id}/users/{user_id}",
    {
      params: {
        path: { space_id: spaceId, user_id: userId },
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
}
