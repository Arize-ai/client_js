import {
  RawAnnotation,
  RawEvaluation,
  RawSpan,
  RawSpanContext,
  RawSpanEvent,
} from "../../types/internal";

const mockDateString = "2021-01-01T00:00:00.000Z";

export const mockSpanContext: RawSpanContext = {
  trace_id: "test-trace-id",
  span_id: "test-span-id",
};

export const mockSpanEvent: RawSpanEvent = {
  name: "test-event",
  timestamp: mockDateString,
  attributes: { key: "value" },
};

export const mockAnnotation: RawAnnotation = {
  name: "accuracy",
  score: 0.9,
  label: "correct",
  text: "Looks good",
  updated_at: mockDateString,
  annotator: { id: "user-1", email: "test@example.com" },
};

export const mockEvaluation: RawEvaluation = {
  name: "relevance",
  score: 0.95,
  label: "relevant",
  explanation: "The response is relevant",
};

export const mockSpan: RawSpan = {
  name: "test-span",
  context: mockSpanContext,
  kind: "LLM",
  parent_id: "test-parent-id",
  start_time: mockDateString,
  end_time: mockDateString,
  status_code: "OK",
  status_message: "Success",
  attributes: { key: "value" },
  annotations: [mockAnnotation],
  evaluations: [mockEvaluation],
  events: [mockSpanEvent],
};
