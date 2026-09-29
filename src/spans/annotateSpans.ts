import { createClient } from "../client";
import { WithClient } from "../types";
import { AnnotateRecordInput, RecordGranularity } from "../types/annotations";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findProjectId, toSpaceRef } from "../utils/resolve";

export type AnnotateSpansParams = WithClient<{
  /**
   * The name or ID of the project containing the records to annotate.
   */
  project: string;
  /**
   * An optional space name or ID. Required when `project` is a name.
   */
  space?: string;
  /**
   * Batch of annotations to write. Up to 1000 records per request for
   * `SPAN`/`TRACE` granularity; up to 100 for `SESSION`.
   */
  annotations: AnnotateRecordInput[];
  /**
   * Start of the time window used to look up records. Defaults to 31 days
   * ago, or 7 days ago when `granularity` is `SESSION`.
   */
  startTime?: Date;
  /**
   * End of the time window used to look up records. Defaults to now.
   */
  endTime?: Date;
  /**
   * Whether each `recordId` identifies a span, a trace, or a session.
   * Defaults to `SPAN`.
   *
   * - `SPAN`: `recordId` is a span ID.
   * - `TRACE`: `recordId` must be a trace's root span ID; annotating a
   *   non-root span is rejected.
   * - `SESSION`: `recordId` is a session ID. The annotation is written to
   *   the root span of the session's earliest trace found within the
   *   lookup window.
   */
  granularity?: RecordGranularity;
}>;

/**
 * Write human annotations to a batch of records in a project.
 *
 * Annotations are upserted by annotation config name for each record.
 * Submitting the same annotation config name for the same record
 * overwrites the previous value.
 *
 * `granularity` selects what each `recordId` identifies (span, trace root
 * span, or session — see {@link AnnotateSpansParams.granularity}). Up to
 * 1000 records may be annotated per request for `SPAN`/`TRACE`; up to 100
 * for `SESSION`.
 *
 * Records are looked up within the specified time window (defaulting to the
 * last 31 days, or 7 days for `SESSION`). If any record in the batch is not
 * found within the window, the entire request is rejected with a 404 error.
 *
 * The writes are submitted to the database layer but may not be immediately
 * visible in queries (HTTP 202 Accepted).
 *
 * @param client - An optional ArizeClient instance to use for the request. @default createClient()
 * @param project - The name or ID of the project.
 * @param space - An optional space name or ID. Required when `project` is a name.
 * @param annotations - Batch of {@link AnnotateRecordInput} items. Each item specifies
 *   a `recordId` and `values` (list of annotation values to set).
 * @param startTime - Start of the time window used to look up records. Defaults to 31 days ago
 *   (7 days for `SESSION` granularity).
 * @param endTime - End of the time window used to look up records. Defaults to now.
 * @param granularity - Whether `recordId` identifies a span, a trace, or a session. Defaults to `SPAN`.
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
  granularity,
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
      ...(granularity ? { granularity } : {}),
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
