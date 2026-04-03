import {
  AnnotationQueue,
  AnnotationQueueAssignedUser,
  AnnotationQueueRecord,
  AnnotationQueueRecordAnnotateResult,
  AnnotationQueueRecordAssignResult,
  AnnotationQueueRecordInput,
} from "../types";
import { assertUnreachable } from "../utils/assertUnreachable";
import {
  RawAnnotationQueue,
  RawAnnotationQueueRecord,
  RawAnnotationQueueRecordAnnotateResult,
  RawAnnotationQueueRecordAssignResult,
} from "../types/internal";
import { transformAnnotationConfig } from "../annotation_configs/utils";

export function serializeRecordInput(input: AnnotationQueueRecordInput) {
  switch (input.recordType) {
    case "example":
      return {
        record_type: "example" as const,
        dataset_id: input.datasetId,
        dataset_version_id: input.datasetVersionId,
        example_ids: input.exampleIds,
      };
    case "span":
      return {
        record_type: "span" as const,
        project_id: input.projectId,
        start_time: input.startTime,
        end_time: input.endTime,
        span_ids: input.spanIds,
      };
    default:
      assertUnreachable(input);
  }
}

function transformAssignedUser(raw: {
  user: { id: string; email: string };
  completion_status: "pending" | "completed";
}): AnnotationQueueAssignedUser {
  return {
    user: raw.user,
    completionStatus: raw.completion_status,
  };
}

export function transformAnnotationQueue(
  raw: RawAnnotationQueue,
): AnnotationQueue {
  return {
    id: raw.id,
    name: raw.name,
    spaceId: raw.space_id,
    instructions: raw.instructions,
    annotationConfigs: raw.annotation_configs?.map(transformAnnotationConfig),
    annotators: raw.annotators,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  };
}

export function transformAnnotationQueueRecord(
  raw: RawAnnotationQueueRecord,
): AnnotationQueueRecord {
  return {
    id: raw.id,
    annotationQueueId: raw.annotation_queue_id,
    sourceType: raw.source_type,
    data: raw.data,
    annotations: raw.annotations,
    evaluations: raw.evaluations,
    assignedUsers: raw.assigned_users.map(transformAssignedUser),
  };
}

export function transformAnnotationQueueRecordAnnotateResult(
  raw: RawAnnotationQueueRecordAnnotateResult,
): AnnotationQueueRecordAnnotateResult {
  return {
    id: raw.id,
    annotationQueueId: raw.annotation_queue_id,
    sourceType: raw.source_type,
    annotations: raw.annotations,
  };
}

export function transformAnnotationQueueRecordAssignResult(
  raw: RawAnnotationQueueRecordAssignResult,
): AnnotationQueueRecordAssignResult {
  return {
    id: raw.id,
    annotationQueueId: raw.annotation_queue_id,
    sourceType: raw.source_type,
    assignedUsers: raw.assigned_users.map(transformAssignedUser),
  };
}
