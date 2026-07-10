import { deleteDatasetExamples } from "../src/datasets/deleteDatasetExamples";

(async () => {
  try {
    const result = await deleteDatasetExamples({
      space: "your_space_name_or_id",
      dataset: "your_dataset_name",
      datasetVersionId: "your_dataset_version_id",
      examples: ["your_example_id_1", "your_example_id_2"],
    });
    // eslint-disable-next-line no-console
    console.dir(result, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
