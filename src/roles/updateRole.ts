import { createClient } from "../client";
import { Permission, Role, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformRole } from "./utils";

export type UpdateRoleParams = WithClient<{
  roleId: string;
  name?: string;
  description?: string;
  permissions?: Permission[];
}>;

/**
 * Update a custom role by its ID.
 *
 * At least one of `name`, `description`, or `permissions` must be provided.
 * When `permissions` is provided, the existing permissions are fully replaced.
 * Predefined roles cannot be updated.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param roleId - The ID of the role to update.
 * @param name - An optional updated name for the role.
 * @param description - An optional updated description for the role.
 * @param permissions - An optional replacement set of permissions.
 * @returns The updated {@link Role}.
 * @throws Error if the role cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateRole } from "@arizeai/ax-client"
 *
 * const role = await updateRole({
 *   roleId: "Um9sZTphYmMxMjM=",
 *   permissions: ["PROJECT_READ", "DATASET_READ"],
 * });
 * console.log(role);
 * ```
 */
export async function updateRole({
  client: clientInstance,
  roleId,
  name,
  description,
  permissions,
}: UpdateRoleParams): Promise<Role> {
  warnPreRelease({ functionName: "updateRole", stage: "beta" });
  if (permissions !== undefined && permissions.length === 0) {
    throw new Error("'permissions' must contain at least one permission");
  }
  if (
    name === undefined &&
    description === undefined &&
    permissions === undefined
  ) {
    throw new Error(
      "At least one of 'name', 'description', or 'permissions' must be provided",
    );
  }
  const client = clientInstance ?? createClient();
  const response = await client.PATCH("/v2/roles/{role_id}", {
    params: {
      path: {
        role_id: roleId,
      },
    },
    body: {
      name,
      description,
      permissions,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformRole(response.data);
}
