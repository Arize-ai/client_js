import { createClient } from "../client";
import { DeleteAnnotationQueueRecordsInput, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findAnnotationQueueId, toSpaceRef } from "../utils/resolve";

export type DeleteAnnotationQueueRecordsParams = WithClient<
  {
    /**
     * The name or ID of the annotation queue.
     */
    annotationQueue: string;
    /**
     * An optional space name or ID. Required when `annotationQueue` is a name.
     */
    space?: string;
  } & DeleteAnnotationQueueRecordsInput
>;

/**
 * Delete records from an annotation queue.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationQueue - The name or ID of the annotation queue.
 * @param space - An optional space name or ID. Required when `annotationQueue` is a name.
 * @param recordIds - The IDs of the records to delete.
 * @returns void.
 * @throws Error if the records cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteAnnotationQueueRecords } from "@arizeai/ax-client"
 *
 * await deleteAnnotationQueueRecords({
 *   annotationQueue: "my_queue",
 *   space: "my_space",
 *   recordIds: ["aqr_abc123", "aqr_def456"],
 * });
 * ```
 */
export async function deleteAnnotationQueueRecords({
  client: clientInstance,
  annotationQueue,
  space,
  recordIds,
}: DeleteAnnotationQueueRecordsParams): Promise<void> {
  warnPreRelease({ functionName: "deleteAnnotationQueueRecords" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationQueueId = await findAnnotationQueueId(
    client,
    annotationQueue,
    spaceRef,
  );
  const response = await client.DELETE(
    "/v2/annotation-queues/{annotation_queue_id}/records",
    {
      params: {
        path: {
          annotation_queue_id: annotationQueueId,
        },
      },
      body: {
        record_ids: recordIds,
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
}
