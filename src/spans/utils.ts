import {
  Annotation,
  Evaluation,
  Span,
  SpanContext,
  SpanEvent,
} from "../types/spans";
import {
  RawAnnotation,
  RawEvaluation,
  RawSpan,
  RawSpanContext,
  RawSpanEvent,
} from "../types/internal";

export function transformSpanContext(context: RawSpanContext): SpanContext {
  return {
    traceId: context.trace_id,
    spanId: context.span_id,
  };
}

export function transformSpanEvent(event: RawSpanEvent): SpanEvent {
  return {
    name: event.name,
    timestamp: new Date(event.timestamp),
    attributes: event.attributes,
  };
}

export function transformAnnotation(annotation: RawAnnotation): Annotation {
  return {
    name: annotation.name,
    score: annotation.score,
    label: annotation.label,
    text: annotation.text,
    updatedAt: annotation.updated_at
      ? new Date(annotation.updated_at)
      : undefined,
    annotator: annotation.annotator,
  };
}

export function transformEvaluation(evaluation: RawEvaluation): Evaluation {
  return {
    name: evaluation.name,
    score: evaluation.score,
    label: evaluation.label,
    explanation: evaluation.explanation,
  };
}

export function transformSpan(span: RawSpan): Span {
  return {
    name: span.name,
    context: transformSpanContext(span.context),
    kind: span.kind,
    parentId: span.parent_id,
    startTime: new Date(span.start_time),
    endTime: new Date(span.end_time),
    statusCode: span.status_code,
    statusMessage: span.status_message,
    attributes: span.attributes,
    annotations: span.annotations?.map(transformAnnotation),
    evaluations: span.evaluations?.map(transformEvaluation),
    events: span.events?.map(transformSpanEvent),
  };
}
