import { listDatasetExamples } from "../src/datasets";

(async () => {
  try {
    const response = await listDatasetExamples({
      space: "your_space_name",
      dataset: "your_dataset_name",
    });
    // eslint-disable-next-line no-console
    console.dir(response, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing examples:", error);
  }
})();
