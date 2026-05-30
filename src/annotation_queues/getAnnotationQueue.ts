import { createClient } from "../client";
import { AnnotationQueue, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformAnnotationQueue } from "./utils";
import { findAnnotationQueueId, toSpaceRef } from "../utils/resolve";

export type GetAnnotationQueueParams = WithClient<{
  /**
   * The name or ID of the annotation queue to get.
   */
  annotationQueue: string;
  /**
   * An optional space name or ID. Required when `annotationQueue` is a name.
   */
  space?: string;
}>;

/**
 * Get the information about a specific annotation queue.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationQueue - The name or ID of the annotation queue to get.
 * @param space - An optional space name or ID. Required when `annotationQueue` is a name.
 * @returns An {@link AnnotationQueue}.
 * @throws Error if the annotation queue cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getAnnotationQueue } from "@arizeai/ax-client"
 *
 * const queue = await getAnnotationQueue({ annotationQueue: "my_queue", space: "my_space" });
 * console.log(queue);
 * ```
 */
export async function getAnnotationQueue({
  client: clientInstance,
  annotationQueue,
  space,
}: GetAnnotationQueueParams): Promise<AnnotationQueue> {
  warnPreRelease({ functionName: "getAnnotationQueue", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationQueueId = await findAnnotationQueueId(
    client,
    annotationQueue,
    spaceRef,
  );
  const response = await client.GET(
    "/v2/annotation-queues/{annotation_queue_id}",
    {
      params: {
        path: {
          annotation_queue_id: annotationQueueId,
        },
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationQueue(response.data);
}
