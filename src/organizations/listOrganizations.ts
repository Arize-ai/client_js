import { createClient } from "../client";
import {
  Organization,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformOrganization } from "./utils";

export type ListOrganizationsParams = WithClient<
  PaginationParams & {
    /** Optional case-insensitive substring filter on organization name. */
    name?: string;
  }
>;

/**
 * List the organizations available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - An optional case-insensitive substring filter on organization name.
 * @param limit - An optional limit on the number of organizations to return (max 100).
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link Organization} objects.
 * @throws Error if the organizations cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listOrganizations } from "@arizeai/ax-client"
 *
 * const result = await listOrganizations();
 * console.log(result.data);
 * ```
 */
export async function listOrganizations(
  params: ListOrganizationsParams = {},
): Promise<PaginatedResponse<Organization>> {
  warnPreRelease({ functionName: "listOrganizations", stage: "beta" });
  const { client: clientInstance, name, limit, cursor } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/organizations", {
    params: {
      query: {
        name,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.organizations.map(transformOrganization),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
