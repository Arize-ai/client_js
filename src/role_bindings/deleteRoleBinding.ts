import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type DeleteRoleBindingParams = WithClient<{
  bindingId: string;
}>;

/**
 * Delete a role binding by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param bindingId - The ID of the role binding to delete.
 * @returns void
 * @throws Error if the binding cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteRoleBinding } from "@arizeai/ax-client"
 *
 * await deleteRoleBinding({ bindingId: "your_binding_id" });
 * ```
 */
export async function deleteRoleBinding({
  client: clientInstance,
  bindingId,
}: DeleteRoleBindingParams): Promise<void> {
  warnPreRelease({ functionName: "deleteRoleBinding" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE("/v2/role-bindings/{binding_id}", {
    params: {
      path: {
        binding_id: bindingId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
