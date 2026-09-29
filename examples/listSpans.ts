import { listSpans } from "../src/spans";

(async () => {
  try {
    const spans = await listSpans({
      project: process.env.ARIZE_PROJECT_ID!,
      excludedColumns: ["attributes.embedding.vectors"],
    });
    // eslint-disable-next-line no-console
    console.dir(spans, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing spans:", error);
  }
})();
