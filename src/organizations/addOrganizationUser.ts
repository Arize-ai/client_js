import { createClient } from "../client";
import {
  OrganizationMembership,
  OrganizationRoleAssignment,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformOrganizationMembership } from "./utils";

export type AddOrganizationUserParams = WithClient<{
  /** The unique identifier of the organization. */
  organizationId: string;
  /** The unique identifier of the user to add. */
  userId: string;
  /** The organization-level role to assign to the user. */
  role: OrganizationRoleAssignment;
}>;

/**
 * Add a user to an organization with a specified role.
 *
 * Uses upsert semantics — if the user is already a member, their role is updated.
 *
 * Role constraints:
 * - An `annotator` account role may only be assigned the `annotator` organization role.
 * - A non-annotator account role may not be assigned the `annotator` organization role.
 *
 * Requires organization admin role.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param organizationId - The unique identifier of the organization.
 * @param userId - The unique identifier of the user to add.
 * @param role - The organization-level role assignment. See {@link OrganizationRoleAssignment}.
 * @returns An {@link OrganizationMembership}.
 * @throws Error if the user cannot be added or the response is invalid.
 * @example
 * ```typescript
 * import { addOrganizationUser } from "@arizeai/ax-client"
 *
 * const membership = await addOrganizationUser({
 *   organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
 *   userId: "VXNlcjoxMjM0NQ==",
 *   role: { type: "predefined", name: "member" },
 * });
 * console.log(membership);
 * ```
 */
export async function addOrganizationUser({
  client: clientInstance,
  organizationId,
  userId,
  role,
}: AddOrganizationUserParams): Promise<OrganizationMembership> {
  warnPreRelease({ functionName: "addOrganizationUser", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/organizations/{org_id}/users", {
    params: {
      path: { org_id: organizationId },
    },
    body: {
      user_id: userId,
      role,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformOrganizationMembership(response.data);
}
