import { createClient } from "../client";
import { Organization, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { findOrganizationId } from "../utils/resolve";
import { handleApiError } from "../errors";
import { transformOrganization } from "./utils";

export type GetOrganizationParams = WithClient<{
  /** Organization ID (e.g. `"org_12345"`) or organization name. */
  organization: string;
}>;

/**
 * Get information about a specific organization.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param organization - The organization ID or name.
 * @returns An {@link Organization}.
 * @throws Error if the organization cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getOrganization } from "@arizeai/ax-client"
 *
 * const org = await getOrganization({ organization: "my-organization" });
 * console.log(org);
 * ```
 */
export async function getOrganization({
  client: clientInstance,
  organization,
}: GetOrganizationParams): Promise<Organization> {
  warnPreRelease({ functionName: "getOrganization" });
  const client = clientInstance ?? createClient();
  const orgId = await findOrganizationId(client, organization);
  const response = await client.GET("/v2/organizations/{org_id}", {
    params: {
      path: {
        org_id: orgId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformOrganization(response.data);
}
