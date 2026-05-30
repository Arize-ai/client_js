import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { findAnnotationQueueId, toSpaceRef } from "../utils/resolve";

export type DeleteAnnotationQueueParams = WithClient<{
  /**
   * The name or ID of the annotation queue to delete.
   */
  annotationQueue: string;
  /**
   * An optional space name or ID. Required when `annotationQueue` is a name.
   */
  space?: string;
}>;

/**
 * Delete an annotation queue by its name or ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationQueue - The name or ID of the annotation queue to delete.
 * @param space - An optional space name or ID. Required when `annotationQueue` is a name.
 * @returns void.
 * @throws Error if the annotation queue cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteAnnotationQueue } from "@arizeai/ax-client"
 *
 * await deleteAnnotationQueue({ annotationQueue: "my_queue", space: "my_space" });
 * ```
 */
export async function deleteAnnotationQueue({
  client: clientInstance,
  annotationQueue,
  space,
}: DeleteAnnotationQueueParams): Promise<void> {
  warnPreRelease({ functionName: "deleteAnnotationQueue", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationQueueId = await findAnnotationQueueId(
    client,
    annotationQueue,
    spaceRef,
  );
  const response = await client.DELETE(
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
}
