import { createClient } from "../client";
import { Permission, Role, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformRole } from "./utils";

export type CreateRoleParams = WithClient<{
  name: string;
  permissions: Permission[];
  description?: string;
}>;

/**
 * Create a new custom role.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the role to create. Must be unique within the account.
 * @param permissions - The list of permissions to grant. At least one is required.
 * @param description - An optional description for the role.
 * @returns A {@link Role}.
 * @throws Error if the role cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createRole } from "@arizeai/ax-client"
 *
 * const role = await createRole({
 *   name: "AI Engineer",
 *   permissions: ["PROJECT_READ", "DATASET_READ", "DATASET_CREATE"],
 *   description: "Can read and create datasets and experiments.",
 * });
 * console.log(role);
 * ```
 */
export async function createRole({
  client: clientInstance,
  name,
  permissions,
  description,
}: CreateRoleParams): Promise<Role> {
  warnPreRelease({ functionName: "createRole", stage: "beta" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/roles", {
    body: {
      name,
      permissions,
      description,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformRole(response.data);
}
