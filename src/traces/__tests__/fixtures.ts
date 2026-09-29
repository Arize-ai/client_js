import { RawTrace } from "../../types/internal";
import { mockSpan } from "../../spans/__tests__/fixtures";

const mockDateString = "2021-01-01T00:00:00.000Z";

export const mockTrace: RawTrace = {
  trace_id: "test-trace-id",
  root_span_id: "test-root-span-id",
  start_time: mockDateString,
  end_time: mockDateString,
  spans_truncated: false,
  spans: [mockSpan],
};

export const mockTraceWithoutTimes: RawTrace = {
  trace_id: "test-trace-id",
  root_span_id: "test-root-span-id",
  spans_truncated: true,
  spans: [],
};
