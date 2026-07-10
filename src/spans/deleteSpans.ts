import { createClient } from "../client";
import type { components } from "../__generated__/api/v2";
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

export type SpanDeleteResult = {
  /**
   * `true` when the server fully processed all data for the request — no
   * retry is needed. `false` when processing could not fully complete;
   * retry the original full request (the delete is idempotent).
   */
  completed: boolean;
  /** Span IDs confirmed deleted in this request. */
  deletedSpanIds: string[];
  /**
   * Requested span IDs that were not deleted. When `completed` is `true`,
   * these were not found (never ingested or already deleted). When
   * `completed` is `false`, some IDs may not have been reached — retry to
   * resolve them.
   */
  notDeletedSpanIds: string[];
};

function transformDeleteResponse(
  raw: components["schemas"]["SpanDeleteResponse"],
): SpanDeleteResult {
  return {
    completed: raw.completed,
    deletedSpanIds: raw.deleted_span_ids,
    notDeletedSpanIds: raw.not_deleted_span_ids,
  };
}

/**
 * Permanently delete spans by their IDs.
 *
 * This operation is irreversible. Only spans within the supported
 * lookback window (2 years) are considered; older spans are not affected.
 *
 * All span IDs are sent in a single request (maximum 5,000 per call).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param project - The project name or ID containing the spans.
 * @param space - An optional space name or ID. Required when `project` is a name.
 * @param spanIds - The IDs of the spans to delete.
 * @returns A {@link SpanDeleteResult} with `completed`, `deletedSpanIds`, and
 *   `notDeletedSpanIds`. When `completed` is `false`, retry the original full
 *   request — the delete is idempotent.
 * @throws Error if the spans cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteSpans } from "@arizeai/ax-client"
 *
 * // By project ID
 * const result = await deleteSpans({
 *   project: "UHJvamVjdDox",
 *   spanIds: ["a1b2c3d4e5f6a7b8", "f8e7d6c5b4a39281"],
 * });
 * if (!result.completed) {
 *   // retry the original full request
 * }
 *
 * // By project name (requires space)
 * const result = await deleteSpans({
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
}: DeleteSpansParams): Promise<SpanDeleteResult> {
  warnPreRelease({ functionName: "deleteSpans", stage: "beta" });
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
  return transformDeleteResponse(response.data);
}
