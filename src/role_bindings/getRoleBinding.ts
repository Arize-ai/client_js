import { createClient } from "../client";
import { RoleBinding, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformRoleBinding } from "./utils";

export type GetRoleBindingParams = WithClient<{
  bindingId: string;
}>;

/**
 * Get a role binding by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param bindingId - The ID of the role binding to retrieve.
 * @returns A {@link RoleBinding}.
 * @throws Error if the binding cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getRoleBinding } from "@arizeai/ax-client"
 *
 * const binding = await getRoleBinding({ bindingId: "Um9sZUJpbmRpbmc6YWJjMTIz" });
 * console.log(binding);
 * ```
 */
export async function getRoleBinding({
  client: clientInstance,
  bindingId,
}: GetRoleBindingParams): Promise<RoleBinding> {
  warnPreRelease({ functionName: "getRoleBinding" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/role-bindings/{binding_id}", {
    params: {
      path: {
        binding_id: bindingId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformRoleBinding(response.data);
}
