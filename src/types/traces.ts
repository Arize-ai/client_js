import { components } from "../__generated__/api/v2";
import { Span } from "./spans";

export type { Span };

type RawTrace = components["schemas"]["Trace"];

export type Trace = {
  traceId: RawTrace["trace_id"];
  rootSpanId: RawTrace["root_span_id"];
  startTime?: Date;
  endTime?: Date;
  spansTruncated: RawTrace["spans_truncated"];
  spans: Span[];
};
