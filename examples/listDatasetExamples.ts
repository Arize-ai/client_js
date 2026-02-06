import { listDatasetExamples } from "../src/datasets";

(async () => {
  try {
    const response = await listDatasetExamples({
      datasetId: "your_dataset_id",
    });
    // eslint-disable-next-line no-console
    console.dir(response, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing examples:", error);
  }
})();
