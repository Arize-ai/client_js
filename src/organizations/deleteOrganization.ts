import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findOrganizationId } from "../utils/resolve";

export type DeleteOrganizationParams = WithClient<{
  /**
   * The organization ID (e.g. `"org_abc123"`) or organization name to delete.
   */
  organization: string;
}>;

/**
 * Delete an organization by its name or ID.
 *
 * This operation is irreversible and deletes the organization and all
 * resources that belong to it, including all spaces and their contents
 * (projects, experiments, evaluators, models, monitors, dashboards,
 * datasets, annotation configs, annotation queues, custom metrics, etc.)
 * as well as organization-level resources (integrations, cost
 * configurations, SAML identity providers, and API keys).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param organization - The organization ID or name to delete.
 * @returns void.
 * @throws Error if the organization cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteOrganization } from "@arizeai/ax-client"
 *
 * await deleteOrganization({ organization: "my-organization" });
 * ```
 */
export async function deleteOrganization({
  client: clientInstance,
  organization,
}: DeleteOrganizationParams): Promise<void> {
  warnPreRelease({ functionName: "deleteOrganization" });
  const client = clientInstance ?? createClient();
  const orgId = await findOrganizationId(client, organization);
  const response = await client.DELETE("/v2/organizations/{org_id}", {
    params: {
      path: { org_id: orgId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
