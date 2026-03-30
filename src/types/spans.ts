import { components } from "../__generated__/api/v2";

type RawSpan = components["schemas"]["Span"];
type RawSpanContext = components["schemas"]["SpanContext"];
type RawSpanEvent = components["schemas"]["SpanEvent"];
type RawAnnotation = components["schemas"]["Annotation"];
type RawEvaluation = components["schemas"]["Evaluation"];

export type SpanContext = {
  traceId: RawSpanContext["trace_id"];
  spanId: RawSpanContext["span_id"];
};

export type SpanEvent = {
  name: RawSpanEvent["name"];
  timestamp: Date;
  attributes?: RawSpanEvent["attributes"];
};

export type Annotation = {
  name: RawAnnotation["name"];
  score?: RawAnnotation["score"];
  label?: RawAnnotation["label"];
  text?: RawAnnotation["text"];
  updatedAt?: Date;
  annotator?: RawAnnotation["annotator"];
};

export type Evaluation = {
  name: RawEvaluation["name"];
  score?: RawEvaluation["score"];
  label?: RawEvaluation["label"];
  explanation?: RawEvaluation["explanation"];
};

export type Span = {
  name: RawSpan["name"];
  context: SpanContext;
  kind: RawSpan["kind"];
  parentId?: RawSpan["parent_id"];
  startTime: Date;
  endTime: Date;
  statusCode?: RawSpan["status_code"];
  statusMessage?: RawSpan["status_message"];
  attributes?: RawSpan["attributes"];
  annotations?: Annotation[];
  evaluations?: Evaluation[];
  events?: SpanEvent[];
};
