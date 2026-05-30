import { createClient } from "../client";
import { SpaceMembership, SpaceRoleAssignment, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformSpaceMembership } from "./utils";

export type AddSpaceUserParams = WithClient<{
  /** The unique identifier of the space. */
  spaceId: string;
  /** The unique identifier of the user to add. */
  userId: string;
  /** The space-level role to assign to the user. */
  role: SpaceRoleAssignment;
}>;

/**
 * Add a user to a space with a specified role.
 *
 * Uses upsert semantics — if the user is already a member, their role is updated.
 * The user must already be a member of the space's parent organization.
 *
 * Role constraints:
 * - An `annotator` account role may only be assigned the `annotator` space role.
 * - A non-annotator account role may not be assigned the `annotator` space role.
 *
 * Requires space admin role (predefined role) or `ROLE_BINDING_CREATE` permission (custom role).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - The unique identifier of the space.
 * @param userId - The unique identifier of the user to add.
 * @param role - The space-level role assignment. See {@link SpaceRoleAssignment}.
 * @returns A {@link SpaceMembership}.
 * @throws Error if the user cannot be added or the response is invalid.
 * @example
 * ```typescript
 * import { addSpaceUser } from "@arizeai/ax-client"
 *
 * const membership = await addSpaceUser({
 *   spaceId: "U3BhY2U6YWJjMTIz",
 *   userId: "VXNlcjoxMjM0NQ==",
 *   role: { type: "predefined", name: "member" },
 * });
 * console.log(membership);
 * ```
 */
export async function addSpaceUser({
  client: clientInstance,
  spaceId,
  userId,
  role,
}: AddSpaceUserParams): Promise<SpaceMembership> {
  warnPreRelease({ functionName: "addSpaceUser", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/spaces/{space_id}/users", {
    params: {
      path: { space_id: spaceId },
    },
    body: {
      user_id: userId,
      role,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformSpaceMembership(response.data);
}
