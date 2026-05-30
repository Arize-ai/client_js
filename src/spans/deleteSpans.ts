import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findProjectId, toSpaceRef } from "../utils/resolve";

export type DeleteSpansParams = WithClient<{
  /**
   * The project name or ID containing the spans to delete.
   */
  project: string;
  /**
   * The space name or ID. Required when `project` is a name.
   */
  space?: string;
  /**
   * List of span IDs to delete.
   */
  spanIds: string[];
}>;

/**
 * Permanently delete spans by their IDs.
 *
 * This operation is irreversible. Only spans within the supported
 * lookback window (2 years) are considered; older spans are not affected.
 * If one or more span IDs are not found, they are silently ignored.
 *
 * All span IDs are sent in a single request (maximum 5,000 per call).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param project - The project name or ID containing the spans.
 * @param space - An optional space name or ID. Required when `project` is a name.
 * @param spanIds - The IDs of the spans to delete.
 * @throws Error if the spans cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteSpans } from "@arizeai/ax-client"
 *
 * // By project ID
 * await deleteSpans({
 *   project: "UHJvamVjdDox",
 *   spanIds: ["a1b2c3d4e5f6a7b8", "f8e7d6c5b4a39281"],
 * });
 *
 * // By project name (requires space)
 * await deleteSpans({
 *   project: "My Project",
 *   space: "my-space",
 *   spanIds: ["a1b2c3d4e5f6a7b8"],
 * });
 * ```
 */
export async function deleteSpans({
  client: clientInstance,
  project,
  space,
  spanIds,
}: DeleteSpansParams): Promise<void> {
  warnPreRelease({ functionName: "deleteSpans", stage: "alpha" });
  if (spanIds.length === 0) {
    throw new Error("spanIds must not be empty");
  }
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const projectId = await findProjectId(client, project, spaceRef);

  const response = await client.DELETE("/v2/spans", {
    body: {
      project_id: projectId,
      span_ids: spanIds,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
