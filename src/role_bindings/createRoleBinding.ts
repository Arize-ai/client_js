import { createClient } from "../client";
import { RoleBinding, RoleBindingResourceType, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformRoleBinding } from "./utils";

export type CreateRoleBindingParams = WithClient<{
  userId: string;
  roleId: string;
  resourceType: RoleBindingResourceType;
  resourceId: string;
}>;

/**
 * Create a new role binding.
 *
 * Assigns a role to a user on the specified resource. Only one binding per
 * user per resource is allowed — if the user already has a binding on the
 * resource, the request returns a `409 Conflict` error.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param userId - The global ID of the user to bind the role to.
 * @param roleId - The global ID of the role to assign.
 * @param resourceType - The type of resource (`"SPACE"` or `"PROJECT"`).
 * @param resourceId - The global ID of the resource. Must encode the same type as `resourceType`.
 * @returns A {@link RoleBinding}.
 * @throws Error if the binding cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createRoleBinding } from "@arizeai/ax-client"
 *
 * const binding = await createRoleBinding({
 *   userId: "your_user_id",
 *   roleId: "your_role_id",
 *   resourceType: "PROJECT",
 *   resourceId: "your_project_id",
 * });
 * console.log(binding);
 * ```
 */
export async function createRoleBinding({
  client: clientInstance,
  userId,
  roleId,
  resourceType,
  resourceId,
}: CreateRoleBindingParams): Promise<RoleBinding> {
  warnPreRelease({ functionName: "createRoleBinding" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/role-bindings", {
    body: {
      user_id: userId,
      role_id: roleId,
      resource_type: resourceType,
      resource_id: resourceId,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformRoleBinding(response.data);
}
