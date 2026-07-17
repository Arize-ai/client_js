import { createClient } from "../client";
import {
  AnnotationQueue,
  CreateAnnotationQueueInput,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { serializeRecordInput, transformAnnotationQueue } from "./utils";

export type CreateAnnotationQueueParams =
  WithClient<CreateAnnotationQueueInput>;

/**
 * Create a new annotation queue.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the annotation queue. Must be unique within the space.
 * @param spaceId - The space ID that the annotation queue belongs to.
 * @param annotationConfigIds - IDs of annotation configs to associate with this queue.
 * @param annotatorEmails - Email addresses of annotators to assign to the queue.
 * @param instructions - Optional instructions for annotators.
 * @param assignmentMethod - How records are assigned to annotators: "ALL" or "RANDOM". Defaults to "ALL".
 * @param recordSources - Optional record sources to add on creation.
 * @returns A created {@link AnnotationQueue}.
 * @throws Error if the annotation queue cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createAnnotationQueue } from "@arizeai/ax-client"
 *
 * const queue = await createAnnotationQueue({
 *   name: "Quality Review Queue",
 *   spaceId: "your_space_id",
 *   annotationConfigIds: ["ac_abc123"],
 *   annotatorEmails: ["reviewer@example.com"],
 *   assignmentMethod: "ALL",
 * });
 * console.log(queue);
 * ```
 */
export async function createAnnotationQueue({
  client: clientInstance,
  name,
  spaceId,
  instructions,
  annotationConfigIds,
  annotatorEmails,
  assignmentMethod,
  recordSources,
}: CreateAnnotationQueueParams): Promise<AnnotationQueue> {
  warnPreRelease({ functionName: "createAnnotationQueue", stage: "beta" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/annotation-queues", {
    body: {
      name,
      space_id: spaceId,
      instructions,
      annotation_config_ids: annotationConfigIds,
      annotator_emails: annotatorEmails,
      assignment_method: assignmentMethod,
      record_sources: recordSources?.map(serializeRecordInput),
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationQueue(response.data);
}
