import { createClient } from "../client";
import {
  AddAnnotationQueueRecordsInput,
  AnnotationQueueRecord,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { serializeRecordInput, transformAnnotationQueueRecord } from "./utils";
import { findAnnotationQueueId, toSpaceRef } from "../utils/resolve";

export type AddAnnotationQueueRecordsParams = WithClient<
  {
    /**
     * The name or ID of the annotation queue to add records to.
     */
    annotationQueue: string;
    /**
     * An optional space name or ID. Required when `annotationQueue` is a name.
     */
    space?: string;
  } & AddAnnotationQueueRecordsInput
>;

/**
 * Add records to an annotation queue.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationQueue - The name or ID of the annotation queue to add records to.
 * @param space - An optional space name or ID. Required when `annotationQueue` is a name.
 * @param recordSources - The record sources to add. At most 2 sources per request.
 * @returns A list of created {@link AnnotationQueueRecord} objects.
 * @throws Error if the records cannot be added or the response is invalid.
 * @example
 * ```typescript
 * import { addAnnotationQueueRecords } from "@arizeai/ax-client"
 *
 * const records = await addAnnotationQueueRecords({
 *   annotationQueue: "my_queue",
 *   space: "my_space",
 *   recordSources: [
 *     {
 *       recordType: "SPAN",
 *       projectId: "proj_abc123",
 *       startTime: "2024-01-15T00:00:00Z",
 *       endTime: "2024-01-15T23:59:59Z",
 *       spanIds: ["span_abc123"],
 *     },
 *   ],
 * });
 * console.log(records);
 * ```
 */
export async function addAnnotationQueueRecords({
  client: clientInstance,
  annotationQueue,
  space,
  recordSources,
}: AddAnnotationQueueRecordsParams): Promise<AnnotationQueueRecord[]> {
  warnPreRelease({ functionName: "addAnnotationQueueRecords", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationQueueId = await findAnnotationQueueId(
    client,
    annotationQueue,
    spaceRef,
  );
  const response = await client.POST(
    "/v2/annotation-queues/{annotation_queue_id}/records",
    {
      params: {
        path: {
          annotation_queue_id: annotationQueueId,
        },
      },
      body: {
        record_sources: recordSources.map(serializeRecordInput),
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return response.data.record_sources.map(transformAnnotationQueueRecord);
}
