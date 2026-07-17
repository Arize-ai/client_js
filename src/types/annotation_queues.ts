import { components } from "../__generated__/api/v2";
import { AnnotationConfig } from "./annotation_configs";

type AnnotatorUser = components["schemas"]["AnnotatorUser"];
type Annotation = components["schemas"]["Annotation"];
type Evaluation = components["schemas"]["Evaluation"];

export interface AnnotationQueueAssignedUser {
  user: AnnotatorUser;
  completionStatus: components["schemas"]["AnnotationQueueCompletionStatus"];
}

export interface AnnotationQueue {
  id: string;
  name: string;
  spaceId: string;
  instructions?: string | null;
  annotationConfigs?: AnnotationConfig[];
  annotators: AnnotatorUser[];
  createdAt: Date;
  updatedAt: Date;
}

export type AnnotationQueueRecordSourceType =
  components["schemas"]["AnnotationQueueSourceType"];

export interface AnnotationQueueRecord {
  id: string;
  annotationQueueId: string;
  sourceType: AnnotationQueueRecordSourceType;
  data: Record<string, unknown>;
  annotations: Annotation[];
  evaluations: Evaluation[];
  assignedUsers: AnnotationQueueAssignedUser[];
}

export interface AnnotateAnnotationQueueRecordResponse {
  id: string;
  annotationQueueId: string;
  sourceType: AnnotationQueueRecordSourceType;
  annotations: Annotation[];
}

export interface AssignAnnotationQueueRecordResponse {
  id: string;
  annotationQueueId: string;
  sourceType: AnnotationQueueRecordSourceType;
  assignedUsers: AnnotationQueueAssignedUser[];
}

export interface AnnotationInput {
  name: string;
  score?: number;
  label?: string;
  text?: string;
}

export interface AnnotationQueueExampleRecordInput {
  recordType: "EXAMPLE";
  datasetId: string;
  datasetVersionId?: string;
  exampleIds?: string[];
}

export interface AnnotationQueueSpanRecordInput {
  recordType: "SPAN";
  projectId: string;
  startTime: string;
  endTime: string;
  spanIds: string[];
}

export type AnnotationQueueRecordInput =
  | AnnotationQueueExampleRecordInput
  | AnnotationQueueSpanRecordInput;

export interface CreateAnnotationQueueInput {
  name: string;
  spaceId: string;
  instructions?: string;
  annotationConfigIds: string[];
  annotatorEmails: string[];
  assignmentMethod?: components["schemas"]["AssignmentMethod"];
  recordSources?: AnnotationQueueRecordInput[];
}

export interface UpdateAnnotationQueueInput {
  name?: string;
  /** Pass an empty string (`""`) to clear existing instructions. */
  instructions?: string;
  annotationConfigIds?: string[];
  annotatorEmails?: string[];
}

export interface AddAnnotationQueueRecordsInput {
  recordSources: AnnotationQueueRecordInput[];
}

export interface DeleteAnnotationQueueRecordsInput {
  recordIds: string[];
}

export interface AnnotateAnnotationQueueRecordInput {
  annotationQueue: string;
  space?: string;
  annotationQueueRecordId: string;
  annotations: AnnotationInput[];
}

export interface AssignAnnotationQueueRecordInput {
  annotationQueue: string;
  space?: string;
  annotationQueueRecordId: string;
  assignedUserEmails: string[];
}
