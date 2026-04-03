import { describe, expect, it } from "vitest";
import {
  serializeRecordInput,
  transformAnnotationQueue,
  transformAnnotationQueueRecord,
  transformAnnotationQueueRecordAnnotateResult,
  transformAnnotationQueueRecordAssignResult,
} from "../utils";
import {
  mockRawAnnotationQueue,
  mockRawAnnotationQueueRecord,
  mockRawAnnotationQueueRecordAnnotateResult,
  mockRawAnnotationQueueRecordAssignResult,
} from "./fixtures";

describe("transformAnnotationQueue", () => {
  it("should transform snake_case fields and convert date strings to Date objects", () => {
    const result = transformAnnotationQueue(mockRawAnnotationQueue);
    expect(result).toEqual({
      id: mockRawAnnotationQueue.id,
      name: mockRawAnnotationQueue.name,
      spaceId: mockRawAnnotationQueue.space_id,
      instructions: mockRawAnnotationQueue.instructions,
      annotationConfigs: [],
      annotators: [],
      createdAt: new Date(mockRawAnnotationQueue.created_at),
      updatedAt: new Date(mockRawAnnotationQueue.updated_at),
    });
  });
});

describe("transformAnnotationQueueRecord", () => {
  it("should transform snake_case fields and map assigned_users to camelCase", () => {
    const result = transformAnnotationQueueRecord(mockRawAnnotationQueueRecord);
    expect(result).toEqual({
      id: mockRawAnnotationQueueRecord.id,
      annotationQueueId: mockRawAnnotationQueueRecord.annotation_queue_id,
      sourceType: mockRawAnnotationQueueRecord.source_type,
      data: mockRawAnnotationQueueRecord.data,
      annotations: mockRawAnnotationQueueRecord.annotations,
      evaluations: mockRawAnnotationQueueRecord.evaluations,
      assignedUsers: [
        {
          user: mockRawAnnotationQueueRecord.assigned_users[0]!.user,
          completionStatus:
            mockRawAnnotationQueueRecord.assigned_users[0]!.completion_status,
        },
      ],
    });
  });
});

describe("transformAnnotationQueueRecordAnnotateResult", () => {
  it("should transform snake_case fields to camelCase", () => {
    const result = transformAnnotationQueueRecordAnnotateResult(
      mockRawAnnotationQueueRecordAnnotateResult,
    );
    expect(result).toEqual({
      id: mockRawAnnotationQueueRecordAnnotateResult.id,
      annotationQueueId:
        mockRawAnnotationQueueRecordAnnotateResult.annotation_queue_id,
      sourceType: mockRawAnnotationQueueRecordAnnotateResult.source_type,
      annotations: mockRawAnnotationQueueRecordAnnotateResult.annotations,
    });
  });
});

describe("transformAnnotationQueueRecordAssignResult", () => {
  it("should transform snake_case fields and map assigned_users to camelCase", () => {
    const result = transformAnnotationQueueRecordAssignResult(
      mockRawAnnotationQueueRecordAssignResult,
    );
    expect(result).toEqual({
      id: mockRawAnnotationQueueRecordAssignResult.id,
      annotationQueueId:
        mockRawAnnotationQueueRecordAssignResult.annotation_queue_id,
      sourceType: mockRawAnnotationQueueRecordAssignResult.source_type,
      assignedUsers: [
        {
          user: mockRawAnnotationQueueRecordAssignResult.assigned_users[0]!
            .user,
          completionStatus:
            mockRawAnnotationQueueRecordAssignResult.assigned_users[0]!
              .completion_status,
        },
      ],
    });
  });
});

describe("serializeRecordInput", () => {
  it("should serialize an example record input to snake_case", () => {
    const result = serializeRecordInput({
      recordType: "example",
      datasetId: "ds_001",
      datasetVersionId: "dv_002",
      exampleIds: ["ex_003"],
    });
    expect(result).toEqual({
      record_type: "example",
      dataset_id: "ds_001",
      dataset_version_id: "dv_002",
      example_ids: ["ex_003"],
    });
  });

  it("should serialize a span record input to snake_case", () => {
    const result = serializeRecordInput({
      recordType: "span",
      projectId: "proj_001",
      startTime: "2024-01-01T00:00:00Z",
      endTime: "2024-01-02T00:00:00Z",
      spanIds: ["span_abc"],
    });
    expect(result).toEqual({
      record_type: "span",
      project_id: "proj_001",
      start_time: "2024-01-01T00:00:00Z",
      end_time: "2024-01-02T00:00:00Z",
      span_ids: ["span_abc"],
    });
  });
});
