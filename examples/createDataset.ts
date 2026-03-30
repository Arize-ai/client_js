import { createDataset } from "../src/datasets/createDataset";

(async () => {
  try {
    const dataset = await createDataset({
      space: "your_space_name",
      examples: [{ question: "What is 2+2?", answer: "4", topic: "math" }],
      name: "your_dataset_name",
    });
    // eslint-disable-next-line no-console
    console.dir(dataset, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating dataset:", error);
  }
})();
