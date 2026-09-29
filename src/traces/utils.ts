import { Trace } from "../types/traces";
import { RawTrace } from "../types/internal";
import { transformSpan } from "../spans/utils";

export function transformTrace(trace: RawTrace): Trace {
  return {
    traceId: trace.trace_id,
    rootSpanId: trace.root_span_id,
    startTime: trace.start_time ? new Date(trace.start_time) : undefined,
    endTime: trace.end_time ? new Date(trace.end_time) : undefined,
    spansTruncated: trace.spans_truncated,
    spans: trace.spans.map(transformSpan),
  };
}
