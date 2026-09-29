import { describe, expect, it } from "vitest";
import { transformSpan } from "../../spans/utils";
import { transformTrace } from "../utils";
import { mockSpan } from "../../spans/__tests__/fixtures";
import { mockTrace, mockTraceWithoutTimes } from "./fixtures";

describe("transformTrace", () => {
  it("should transform snake_case fields to camelCase and parse times", () => {
    const result = transformTrace(mockTrace);
    expect(result).toEqual({
      traceId: mockTrace.trace_id,
      rootSpanId: mockTrace.root_span_id,
      startTime: new Date(mockTrace.start_time!),
      endTime: new Date(mockTrace.end_time!),
      spansTruncated: mockTrace.spans_truncated,
      spans: [transformSpan(mockSpan)],
    });
  });

  it("should leave startTime/endTime undefined when omitted and map empty spans", () => {
    const result = transformTrace(mockTraceWithoutTimes);
    expect(result.startTime).toBeUndefined();
    expect(result.endTime).toBeUndefined();
    expect(result.spansTruncated).toBe(true);
    expect(result.spans).toEqual([]);
  });
});
