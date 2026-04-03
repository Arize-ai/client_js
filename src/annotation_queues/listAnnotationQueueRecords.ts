import { createClient } from "../client";
import {
  AnnotationQueueRecord,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformAnnotationQueueRecord } from "./utils";
import { findAnnotationQueueId, toSpaceRef } from "../utils/resolve";

export type ListAnnotationQueueRecordsParams = WithClient<
  PaginationParams & {
    /**
     * The name or ID of the annotation queue.
     */
    annotationQueue: string;
    /**
     * An optional space name or ID. Required when `annotationQueue` is a name.
     */
    space?: string;
  }
>;

/**
 * List records in an annotation queue.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationQueue - The name or ID of the annotation queue.
 * @param space - An optional space name or ID. Required when `annotationQueue` is a name.
 * @param limit - An optional limit on the number of records to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link AnnotationQueueRecord} objects.
 * @throws Error if the records cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listAnnotationQueueRecords } from "@arizeai/ax-client"
 *
 * const records = await listAnnotationQueueRecords({ annotationQueue: "my_queue", space: "my_space" });
 * console.log(records);
 * ```
 */
export async function listAnnotationQueueRecords({
  client: clientInstance,
  annotationQueue,
  space,
  limit,
  cursor,
}: ListAnnotationQueueRecordsParams): Promise<
  PaginatedResponse<AnnotationQueueRecord>
> {
  warnPreRelease({ functionName: "listAnnotationQueueRecords" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationQueueId = await findAnnotationQueueId(
    client,
    annotationQueue,
    spaceRef,
  );
  const response = await client.GET(
    "/v2/annotation-queues/{annotation_queue_id}/records",
    {
      params: {
        path: {
          annotation_queue_id: annotationQueueId,
        },
        query: {
          limit,
          cursor,
        },
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.records.map(transformAnnotationQueueRecord),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
