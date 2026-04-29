import { components } from "../__generated__/api/v2";
import { AnnotationInput } from "./annotation_queues";

type RawAnnotation = components["schemas"]["Annotation"];

export type Annotation = {
  name: RawAnnotation["name"];
  score?: RawAnnotation["score"];
  label?: RawAnnotation["label"];
  text?: RawAnnotation["text"];
  updatedAt?: Date;
  annotator?: RawAnnotation["annotator"];
};

/** A single record to annotate in a batch, identified by its record ID. */
export interface AnnotateRecordInput {
  /** The ID of the record (dataset example ID or experiment run ID). */
  recordId: string;
  /** One or more annotation values to set on this record. */
  values: AnnotationInput[];
}

/** The annotation results for a single annotated record. */
export interface AnnotateRecordResult {
  /** The ID of the record that was annotated. */
  recordId: string;
  /** The annotations that were written to this record. */
  annotations: Annotation[];
}

/** Result of a batch annotation operation. Contains one result entry per annotated record. */
export interface AnnotationBatchResult {
  /** Per-record annotation results, in the same order as the request. */
  results: AnnotateRecordResult[];
}

export type { AnnotationInput };
