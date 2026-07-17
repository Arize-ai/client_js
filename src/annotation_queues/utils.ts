import {
  AnnotationQueue,
  AnnotationQueueAssignedUser,
  AnnotationQueueRecord,
  AnnotateAnnotationQueueRecordResponse,
  AssignAnnotationQueueRecordResponse,
  AnnotationQueueRecordInput,
} from "../types";
import { assertUnreachable } from "../utils/assertUnreachable";
import {
  RawAnnotationQueue,
  RawAnnotationQueueRecord,
  RawAnnotateAnnotationQueueRecordResponse,
  RawAssignAnnotationQueueRecordResponse,
} from "../types/internal";
import { transformAnnotationConfig } from "../annotation_configs/utils";
import { components } from "../__generated__/api/v2";

export function serializeRecordInput(input: AnnotationQueueRecordInput) {
  switch (input.recordType) {
    case "EXAMPLE":
      return {
        record_type: "EXAMPLE" as const,
        dataset_id: input.datasetId,
        dataset_version_id: input.datasetVersionId,
        example_ids: input.exampleIds,
      };
    case "SPAN":
      return {
        record_type: "SPAN" as const,
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
  completion_status: components["schemas"]["AnnotationQueueCompletionStatus"];
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

export function transformAnnotateAnnotationQueueRecordResponse(
  raw: RawAnnotateAnnotationQueueRecordResponse,
): AnnotateAnnotationQueueRecordResponse {
  return {
    id: raw.id,
    annotationQueueId: raw.annotation_queue_id,
    sourceType: raw.source_type,
    annotations: raw.annotations,
  };
}

export function transformAssignAnnotationQueueRecordResponse(
  raw: RawAssignAnnotationQueueRecordResponse,
): AssignAnnotationQueueRecordResponse {
  return {
    id: raw.id,
    annotationQueueId: raw.annotation_queue_id,
    sourceType: raw.source_type,
    assignedUsers: raw.assigned_users.map(transformAssignedUser),
  };
}
