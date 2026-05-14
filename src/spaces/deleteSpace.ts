import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findSpaceId } from "../utils/resolve";

export type DeleteSpaceParams = WithClient<{
  /**
   * The space ID (e.g. `"U3BhY2U6YWJjMTIz"`) or space name to delete.
   */
  space: string;
}>;

/**
 * Delete a space by its name or ID.
 *
 * This operation is irreversible and deletes the space and all resources
 * that belong to it (models, monitors, dashboards, datasets, custom metrics, etc).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - The space ID or name to delete.
 * @returns void.
 * @throws Error if the space cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteSpace } from "@arizeai/ax-client"
 *
 * await deleteSpace({ space: "my-space" });
 * ```
 */
export async function deleteSpace({
  client: clientInstance,
  space,
}: DeleteSpaceParams): Promise<void> {
  warnPreRelease({ functionName: "deleteSpace" });
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, space);
  const response = await client.DELETE("/v2/spaces/{space_id}", {
    params: {
      path: { space_id: spaceId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
