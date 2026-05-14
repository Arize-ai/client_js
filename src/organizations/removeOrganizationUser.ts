import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type RemoveOrganizationUserParams = WithClient<{
  /** The unique identifier of the organization. */
  organizationId: string;
  /** The unique identifier of the user to remove. */
  userId: string;
}>;

/**
 * Remove a user from an organization and all its child spaces (membership cascade).
 *
 * Requires organization admin role.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param organizationId - The unique identifier of the organization.
 * @param userId - The unique identifier of the user to remove.
 * @returns void.
 * @throws Error if the user cannot be removed or the response is invalid.
 * @example
 * ```typescript
 * import { removeOrganizationUser } from "@arizeai/ax-client"
 *
 * await removeOrganizationUser({
 *   organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
 *   userId: "VXNlcjoxMjM0NQ==",
 * });
 * ```
 */
export async function removeOrganizationUser({
  client: clientInstance,
  organizationId,
  userId,
}: RemoveOrganizationUserParams): Promise<void> {
  warnPreRelease({ functionName: "removeOrganizationUser" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE(
    "/v2/organizations/{org_id}/users/{user_id}",
    {
      params: {
        path: { org_id: organizationId, user_id: userId },
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
}
