import { createClient } from "../client";
import {
  AssignAnnotationQueueRecordInput,
  AnnotationQueueRecordAssignResult,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformAnnotationQueueRecordAssignResult } from "./utils";
import { findAnnotationQueueId, toSpaceRef } from "../utils/resolve";

export type AssignAnnotationQueueRecordParams =
  WithClient<AssignAnnotationQueueRecordInput>;

/**
 * Assign users to an annotation queue record.
 *
 * Fully replaces the current record-level user assignment. Re-assigning a user who has
 * already completed their annotation resets their completion status to pending.
 * Pass an empty array to remove all record-level assignments.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationQueue - The name or ID of the annotation queue.
 * @param space - An optional space name or ID. Required when `annotationQueue` is a name.
 * @param annotationQueueRecordId - The ID of the record to assign users to.
 * @param assignedUserEmails - Emails of users to assign. Replaces existing record-level assignments entirely.
 * @returns A snapshot of the record with the resulting user assignments.
 * @throws Error if the record cannot be assigned or the response is invalid.
 * @example
 * ```typescript
 * import { assignAnnotationQueueRecord } from "@arizeai/ax-client"
 *
 * const result = await assignAnnotationQueueRecord({
 *   annotationQueue: "my_queue",
 *   space: "my_space",
 *   annotationQueueRecordId: "aqr_abc123",
 *   assignedUserEmails: ["reviewer@example.com"],
 * });
 * console.log(result);
 * ```
 */
export async function assignAnnotationQueueRecord({
  client: clientInstance,
  annotationQueue,
  space,
  annotationQueueRecordId,
  assignedUserEmails,
}: AssignAnnotationQueueRecordParams): Promise<AnnotationQueueRecordAssignResult> {
  warnPreRelease({ functionName: "assignAnnotationQueueRecord" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationQueueId = await findAnnotationQueueId(
    client,
    annotationQueue,
    spaceRef,
  );
  const response = await client.POST(
    "/v2/annotation-queues/{annotation_queue_id}/records/{annotation_queue_record_id}/assign",
    {
      params: {
        path: {
          annotation_queue_id: annotationQueueId,
          annotation_queue_record_id: annotationQueueRecordId,
        },
      },
      body: {
        assigned_user_emails: assignedUserEmails,
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationQueueRecordAssignResult(response.data);
}
