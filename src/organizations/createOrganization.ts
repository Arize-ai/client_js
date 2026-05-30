import { createClient } from "../client";
import { Organization, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformOrganization } from "./utils";

export type CreateOrganizationParams = WithClient<{
  /** Name of the organization (must be unique within the account). */
  name: string;
  /** Optional description of the organization's purpose. */
  description?: string;
}>;

/**
 * Create a new organization.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the organization to create (must be unique within the account).
 * @param description - An optional description for the organization.
 * @returns An {@link Organization}.
 * @throws Error if the organization cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createOrganization } from "@arizeai/ax-client"
 *
 * const org = await createOrganization({
 *   name: "my-organization",
 *   description: "Organization for the platform engineering team",
 * });
 * console.log(org);
 * ```
 */
export async function createOrganization({
  client: clientInstance,
  name,
  description,
}: CreateOrganizationParams): Promise<Organization> {
  warnPreRelease({ functionName: "createOrganization", stage: "beta" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/organizations", {
    body: {
      name,
      description,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformOrganization(response.data);
}
