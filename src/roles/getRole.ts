import { createClient } from "../client";
import { Role, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformRole } from "./utils";

export type GetRoleParams = WithClient<{
  roleId: string;
}>;

/**
 * Get a role by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param roleId - The ID of the role to retrieve.
 * @returns A {@link Role}.
 * @throws Error if the role cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getRole } from "@arizeai/ax-client"
 *
 * const role = await getRole({ roleId: "your_role_id" });
 * console.log(role);
 * ```
 */
export async function getRole({
  client: clientInstance,
  roleId,
}: GetRoleParams): Promise<Role> {
  warnPreRelease({ functionName: "getRole" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/roles/{role_id}", {
    params: {
      path: {
        role_id: roleId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformRole(response.data);
}
