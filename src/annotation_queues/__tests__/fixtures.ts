import {
  RawAnnotationQueue,
  RawAnnotationQueueRecord,
  RawAnnotationQueueRecordAnnotateResult,
  RawAnnotationQueueRecordAssignResult,
} from "../../types/internal";

const mockDateString = "2021-01-01T00:00:00.000Z";
const mockQueueId = "aq_abc123";
const mockQueueName = "Quality Review Queue";
const mockSpaceId = "spc_xyz789";
const mockRecordId = "rec_def456";
const mockUserId = "user_001";
const mockUserEmail = "annotator@example.com";

export const mockRawAnnotationQueue: RawAnnotationQueue = {
  id: mockQueueId,
  name: mockQueueName,
  space_id: mockSpaceId,
  instructions: "Please review each span carefully.",
  annotation_configs: [],
  annotators: [],
  created_at: mockDateString,
  updated_at: mockDateString,
};

const mockAssignedUser = {
  user: { id: mockUserId, email: mockUserEmail },
  completion_status: "pending" as const,
};

export const mockRawAnnotationQueueRecord: RawAnnotationQueueRecord = {
  id: mockRecordId,
  annotation_queue_id: mockQueueId,
  source_type: "spans",
  data: { span_id: "span_001", latency_ms: 42 },
  annotations: [],
  evaluations: [],
  assigned_users: [mockAssignedUser],
};

export const mockRawAnnotationQueueRecordAnnotateResult: RawAnnotationQueueRecordAnnotateResult =
  {
    id: mockRecordId,
    annotation_queue_id: mockQueueId,
    source_type: "spans",
    annotations: [],
  };

export const mockRawAnnotationQueueRecordAssignResult: RawAnnotationQueueRecordAssignResult =
  {
    id: mockRecordId,
    annotation_queue_id: mockQueueId,
    source_type: "spans",
    assigned_users: [mockAssignedUser],
  };
