import { createClient } from "../client";
import { RoleBinding, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformRoleBinding } from "./utils";

export type UpdateRoleBindingParams = WithClient<{
  bindingId: string;
  roleId: string;
}>;

/**
 * Update an existing role binding by replacing its assigned role.
 *
 * Only the `roleId` can be changed on an existing binding. The user,
 * resource type, and resource ID remain the same.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param bindingId - The ID of the role binding to update.
 * @param roleId - The new role ID to assign. Replaces the existing role.
 * @returns The updated {@link RoleBinding}.
 * @throws Error if the binding cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateRoleBinding } from "@arizeai/ax-client"
 *
 * const binding = await updateRoleBinding({
 *   bindingId: "Um9sZUJpbmRpbmc6YWJjMTIz",
 *   roleId: "Um9sZTphYmMxMjM=",
 * });
 * console.log(binding);
 * ```
 */
export async function updateRoleBinding({
  client: clientInstance,
  bindingId,
  roleId,
}: UpdateRoleBindingParams): Promise<RoleBinding> {
  warnPreRelease({ functionName: "updateRoleBinding", stage: "beta" });
  const client = clientInstance ?? createClient();
  const response = await client.PATCH("/v2/role-bindings/{binding_id}", {
    params: {
      path: {
        binding_id: bindingId,
      },
    },
    body: {
      role_id: roleId,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformRoleBinding(response.data);
}
