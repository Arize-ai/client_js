import { createClient } from "../client";
import { WithClient } from "../types";
import { AnnotateRecordInput } from "../types/annotations";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findProjectId, toSpaceRef } from "../utils/resolve";

export type AnnotateSpansParams = WithClient<{
  /**
   * The name or ID of the project containing the spans to annotate.
   */
  project: string;
  /**
   * An optional space name or ID. Required when `project` is a name.
   */
  space?: string;
  /**
   * Batch of annotations to write. Up to 1000 spans per request.
   */
  annotations: AnnotateRecordInput[];
  /**
   * Start of the time window used to look up spans. Defaults to 31 days ago.
   */
  startTime?: Date;
  /**
   * End of the time window used to look up spans. Defaults to now.
   */
  endTime?: Date;
}>;

/**
 * Write human annotations to a batch of spans in a project.
 *
 * Annotations are upserted by annotation config name for each span.
 * Submitting the same annotation config name for the same span
 * overwrites the previous value. Up to 1000 spans may be annotated
 * per request.
 *
 * Spans are looked up within the specified time window (defaulting to the
 * last 31 days). If any span ID in the batch is not found within the window,
 * the entire request is rejected with a 404 error.
 *
 * The writes are submitted to the database layer but may not be immediately
 * visible in queries (HTTP 202 Accepted).
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param project - The name or ID of the project.
 * @param space - An optional space name or ID. Required when `project` is a name.
 * @param annotations - Batch of {@link AnnotateRecordInput} items. Each item specifies
 *   a `recordId` (span ID) and `values` (list of annotation values to set).
 * @param startTime - Start of the time window used to look up spans. Defaults to 31 days ago.
 * @param endTime - End of the time window used to look up spans. Defaults to now.
 * @returns void
 * @throws Error if the annotations cannot be written.
 * @example
 * ```typescript
 * import { annotateSpans } from "@arizeai/ax-client"
 *
 * await annotateSpans({
 *   space: "my_space",
 *   project: "my_project",
 *   annotations: [
 *     {
 *       recordId: "c3Bhbl9pZF9hYmMxMjM=", // base64-encoded span ID
 *       values: [
 *         { name: "quality", score: 0.9 },
 *         { name: "topic", label: "science" },
 *       ],
 *     },
 *   ],
 * });
 * ```
 */
export async function annotateSpans({
  client: clientInstance,
  project,
  space,
  annotations,
  startTime,
  endTime,
}: AnnotateSpansParams): Promise<void> {
  warnPreRelease({ functionName: "annotateSpans", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const projectId = await findProjectId(client, project, spaceRef);
  const response = await client.POST("/v2/spans/annotate", {
    body: {
      project_id: projectId,
      annotations: annotations.map((a) => ({
        record_id: a.recordId,
        values: a.values,
      })),
      ...(startTime ? { start_time: startTime.toISOString() } : {}),
      ...(endTime ? { end_time: endTime.toISOString() } : {}),
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
