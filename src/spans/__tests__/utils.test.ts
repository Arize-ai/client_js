import { describe, expect, it } from "vitest";
import {
  transformAnnotation,
  transformEvaluation,
  transformSpan,
  transformSpanContext,
  transformSpanEvent,
} from "../utils";
import {
  mockAnnotation,
  mockEvaluation,
  mockSpan,
  mockSpanContext,
  mockSpanEvent,
} from "./fixtures";

describe("transformSpanContext", () => {
  it("should transform snake_case fields to camelCase", () => {
    const result = transformSpanContext(mockSpanContext);
    expect(result).toEqual({
      traceId: mockSpanContext.trace_id,
      spanId: mockSpanContext.span_id,
    });
  });
});

describe("transformSpanEvent", () => {
  it("should transform timestamp to a Date object", () => {
    const result = transformSpanEvent(mockSpanEvent);
    expect(result).toEqual({
      name: mockSpanEvent.name,
      timestamp: new Date(mockSpanEvent.timestamp),
      attributes: mockSpanEvent.attributes,
    });
  });
});

describe("transformAnnotation", () => {
  it("should transform updated_at to a Date and camelCase fields", () => {
    const result = transformAnnotation(mockAnnotation);
    expect(result).toEqual({
      name: mockAnnotation.name,
      score: mockAnnotation.score,
      label: mockAnnotation.label,
      text: mockAnnotation.text,
      updatedAt: new Date(mockAnnotation.updated_at!),
      annotator: mockAnnotation.annotator,
    });
  });

  it("should handle missing updated_at", () => {
    const result = transformAnnotation({
      name: mockAnnotation.name,
      score: mockAnnotation.score,
      label: mockAnnotation.label,
      text: mockAnnotation.text,
      annotator: mockAnnotation.annotator,
    });
    expect(result.updatedAt).toBeUndefined();
  });
});

describe("transformEvaluation", () => {
  it("should pass through evaluation fields", () => {
    const result = transformEvaluation(mockEvaluation);
    expect(result).toEqual({
      name: mockEvaluation.name,
      score: mockEvaluation.score,
      label: mockEvaluation.label,
      explanation: mockEvaluation.explanation,
    });
  });
});

describe("transformSpan", () => {
  it("should transform all fields including nested annotations, evaluations, and events", () => {
    const result = transformSpan(mockSpan);
    expect(result).toEqual({
      name: mockSpan.name,
      context: {
        traceId: mockSpan.context.trace_id,
        spanId: mockSpan.context.span_id,
      },
      kind: mockSpan.kind,
      parentId: mockSpan.parent_id,
      startTime: new Date(mockSpan.start_time),
      endTime: new Date(mockSpan.end_time),
      statusCode: mockSpan.status_code,
      statusMessage: mockSpan.status_message,
      attributes: mockSpan.attributes,
      annotations: [
        {
          name: mockAnnotation.name,
          score: mockAnnotation.score,
          label: mockAnnotation.label,
          text: mockAnnotation.text,
          updatedAt: new Date(mockAnnotation.updated_at!),
          annotator: mockAnnotation.annotator,
        },
      ],
      evaluations: [
        {
          name: mockEvaluation.name,
          score: mockEvaluation.score,
          label: mockEvaluation.label,
          explanation: mockEvaluation.explanation,
        },
      ],
      events: [
        {
          name: mockSpanEvent.name,
          timestamp: new Date(mockSpanEvent.timestamp),
          attributes: mockSpanEvent.attributes,
        },
      ],
    });
  });
});
