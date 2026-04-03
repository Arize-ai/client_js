import { createClient } from "../client";
import {
  AnnotationQueue,
  UpdateAnnotationQueueInput,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformAnnotationQueue } from "./utils";
import { findAnnotationQueueId, toSpaceRef } from "../utils/resolve";

export type UpdateAnnotationQueueParams = WithClient<
  {
    /**
     * The name or ID of the annotation queue to update.
     */
    annotationQueue: string;
    /**
     * An optional space name or ID. Required when `annotationQueue` is a name.
     */
    space?: string;
  } & UpdateAnnotationQueueInput
>;

/**
 * Update an annotation queue.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationQueue - The name or ID of the annotation queue to update.
 * @param space - An optional space name or ID. Required when `annotationQueue` is a name.
 * @param name - Optional new name for the queue.
 * @param instructions - Optional new instructions. Send an empty string to clear.
 * @param annotationConfigIds - Optional full replacement list of annotation config IDs.
 * @param annotatorEmails - Optional full replacement list of annotator emails.
 * @returns The updated {@link AnnotationQueue}.
 * @throws Error if the annotation queue cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateAnnotationQueue } from "@arizeai/ax-client"
 *
 * const queue = await updateAnnotationQueue({
 *   annotationQueue: "my_queue",
 *   space: "my_space",
 *   name: "Updated Queue Name",
 * });
 * console.log(queue);
 * ```
 */
export async function updateAnnotationQueue({
  client: clientInstance,
  annotationQueue,
  space,
  name,
  instructions,
  annotationConfigIds,
  annotatorEmails,
}: UpdateAnnotationQueueParams): Promise<AnnotationQueue> {
  warnPreRelease({ functionName: "updateAnnotationQueue" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationQueueId = await findAnnotationQueueId(
    client,
    annotationQueue,
    spaceRef,
  );
  const response = await client.PATCH(
    "/v2/annotation-queues/{annotation_queue_id}",
    {
      params: {
        path: {
          annotation_queue_id: annotationQueueId,
        },
      },
      body: {
        name,
        instructions,
        annotation_config_ids: annotationConfigIds,
        annotator_emails: annotatorEmails,
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationQueue(response.data);
}
