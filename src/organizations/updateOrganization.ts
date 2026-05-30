import { createClient } from "../client";
import { Organization, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { findOrganizationId } from "../utils/resolve";
import { handleApiError } from "../errors";
import { transformOrganization } from "./utils";

export type UpdateOrganizationParams = WithClient<{
  /** Organization global ID (base64, e.g. `"T3JnYW5pemF0aW9uOjEyMzQ1"`) or organization name. */
  organization: string;
  /** Updated name for the organization. */
  name?: string;
  /** Updated description for the organization. Pass an empty string to clear it. */
  description?: string;
}>;

/**
 * Update an organization's metadata.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param organization - The organization ID or name.
 * @param name - An optional updated name for the organization.
 * @param description - An optional updated description for the organization.
 * @returns An {@link Organization}.
 * @throws Error if the organization cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateOrganization } from "@arizeai/ax-client"
 *
 * const org = await updateOrganization({
 *   organization: "my-organization",
 *   name: "my-organization-renamed",
 * });
 * console.log(org);
 * ```
 */
export async function updateOrganization({
  client: clientInstance,
  organization,
  name,
  description,
}: UpdateOrganizationParams): Promise<Organization> {
  warnPreRelease({ functionName: "updateOrganization", stage: "beta" });
  const client = clientInstance ?? createClient();
  const orgId = await findOrganizationId(client, organization);
  const response = await client.PATCH("/v2/organizations/{org_id}", {
    params: {
      path: {
        org_id: orgId,
      },
    },
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
