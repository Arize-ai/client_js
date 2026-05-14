import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type DeleteRoleParams = WithClient<{
  roleId: string;
}>;

/**
 * Delete a custom role by its ID. Predefined roles cannot be deleted.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param roleId - The ID of the role to delete.
 * @returns void
 * @throws Error if the role cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteRole } from "@arizeai/ax-client"
 *
 * await deleteRole({ roleId: "Um9sZTphYmMxMjM=" });
 * ```
 */
export async function deleteRole({
  client: clientInstance,
  roleId,
}: DeleteRoleParams): Promise<void> {
  warnPreRelease({ functionName: "deleteRole" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE("/v2/roles/{role_id}", {
    params: {
      path: {
        role_id: roleId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
