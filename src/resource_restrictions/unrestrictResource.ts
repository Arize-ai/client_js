import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type UnrestrictResourceParams = WithClient<{
  resourceId: string;
}>;

/**
 * Remove restriction from a resource.
 *
 * Removing a restriction means that roles bound at other levels of the
 * hierarchy (space, org, account) can once again grant access to the resource.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param resourceId - The global ID of the resource to unrestrict.
 * @returns void
 * @throws Error if the resource is not restricted or the response is invalid.
 * @example
 * ```typescript
 * import { unrestrictResource } from "@arizeai/ax-client"
 *
 * await unrestrictResource({ resourceId: "your_project_id" });
 * ```
 */
export async function unrestrictResource({
  client: clientInstance,
  resourceId,
}: UnrestrictResourceParams): Promise<void> {
  warnPreRelease({ functionName: "unrestrictResource", stage: "beta" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE(
    "/v2/resource-restrictions/{resource_id}",
    {
      params: {
        path: {
          resource_id: resourceId,
        },
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
}
