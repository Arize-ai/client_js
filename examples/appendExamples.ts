import { appendExamples } from "../src/datasets/appendExamples";

(async () => {
  try {
    const dataset = await appendExamples({
      space: "your_space_name_or_id",
      dataset: "your_dataset_name",
      examples: [{ question: "What is 2+2?", answer: "4", topic: "math" }],
    });
    // eslint-disable-next-line no-console
    console.dir(dataset, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
