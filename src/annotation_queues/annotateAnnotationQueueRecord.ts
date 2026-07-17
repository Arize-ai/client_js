import { createClient } from "../client";
import {
  AnnotateAnnotationQueueRecordInput,
  AnnotateAnnotationQueueRecordResponse,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformAnnotateAnnotationQueueRecordResponse } from "./utils";
import { findAnnotationQueueId, toSpaceRef } from "../utils/resolve";

export type AnnotateAnnotationQueueRecordParams =
  WithClient<AnnotateAnnotationQueueRecordInput>;

/**
 * Submit annotations for an annotation queue record.
 *
 * Annotations are upserted by annotation config name. Omitted annotation configs are left unchanged.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationQueue - The name or ID of the annotation queue.
 * @param space - An optional space name or ID. Required when `annotationQueue` is a name.
 * @param annotationQueueRecordId - The ID of the record to annotate.
 * @param annotations - The annotations to submit. Each name must match an annotation config on the queue.
 * @returns A snapshot of the record with the submitted annotations.
 * @throws Error if the record cannot be annotated or the response is invalid.
 * @example
 * ```typescript
 * import { annotateAnnotationQueueRecord } from "@arizeai/ax-client"
 *
 * const result = await annotateAnnotationQueueRecord({
 *   annotationQueue: "my_queue",
 *   space: "my_space",
 *   annotationQueueRecordId: "aqr_abc123",
 *   annotations: [
 *     { name: "accuracy", label: "correct", score: 1.0 },
 *     { name: "quality", text: "Well-structured response" },
 *   ],
 * });
 * console.log(result);
 * ```
 */
export async function annotateAnnotationQueueRecord({
  client: clientInstance,
  annotationQueue,
  space,
  annotationQueueRecordId,
  annotations,
}: AnnotateAnnotationQueueRecordParams): Promise<AnnotateAnnotationQueueRecordResponse> {
  warnPreRelease({
    functionName: "annotateAnnotationQueueRecord",
    stage: "beta",
  });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationQueueId = await findAnnotationQueueId(
    client,
    annotationQueue,
    spaceRef,
  );
  const response = await client.POST(
    "/v2/annotation-queues/{annotation_queue_id}/records/{annotation_queue_record_id}/annotate",
    {
      params: {
        path: {
          annotation_queue_id: annotationQueueId,
          annotation_queue_record_id: annotationQueueRecordId,
        },
      },
      body: {
        annotations,
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotateAnnotationQueueRecordResponse(response.data);
}
