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
  /** The ID of the record (span ID, dataset example ID, or experiment run ID). */
  recordId: string;
  /** One or more annotation values to set on this record. */
  values: AnnotationInput[];
}

export type { AnnotationInput };
