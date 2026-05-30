import { createClient } from "../client";
import { ResourceRestriction, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformResourceRestriction } from "./utils";

export type RestrictResourceParams = WithClient<{
  resourceId: string;
}>;

/**
 * Mark a resource as restricted.
 *
 * Restricting a resource prevents roles bound at higher hierarchy levels
 * (space, org, account) from granting access. Only space admins or users
 * with the `PROJECT_RESTRICT` permission can perform this action.
 *
 * This operation is idempotent. Currently only `PROJECT` resources are supported.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param resourceId - The global ID of the resource to restrict. Must encode a project.
 * @returns A {@link ResourceRestriction}.
 * @throws Error if the resource cannot be restricted or the response is invalid.
 * @example
 * ```typescript
 * import { restrictResource } from "@arizeai/ax-client"
 *
 * const restriction = await restrictResource({ resourceId: "your_project_id" });
 * console.log(restriction);
 * ```
 */
export async function restrictResource({
  client: clientInstance,
  resourceId,
}: RestrictResourceParams): Promise<ResourceRestriction> {
  warnPreRelease({ functionName: "restrictResource", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/resource-restrictions", {
    body: {
      resource_id: resourceId,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformResourceRestriction(response.data.resource_restriction);
}
