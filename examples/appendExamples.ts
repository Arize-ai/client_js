import { appendExamples } from "../src/datasets/appendExamples";

(async () => {
  try {
    const dataset = await appendExamples({
      datasetId: "your_dataset_id",
      examples: [{ question: "What is 2+2?", answer: "4", topic: "math" }],
    });
    // eslint-disable-next-line no-console
    console.dir(dataset, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
