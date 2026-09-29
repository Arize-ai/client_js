import { listTraces } from "../src/traces";

const TRACE_LIMIT = 5;

(async () => {
  try {
    const traces = await listTraces({
      project: process.env.ARIZE_TEST_PROJECT_ID!,
      limit: TRACE_LIMIT,
    });
    // eslint-disable-next-line no-console
    console.dir(traces, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing traces:", error);
  }
})();
