import { listDatasetExamples } from "../src/datasets";

(async () => {
  try {
    const { data: examples, pagination } = await listDatasetExamples({
      space: "your_space_name",
      dataset: "your_dataset_name",
    });
    // eslint-disable-next-line no-console
    console.dir(examples, { depth: null });
    // eslint-disable-next-line no-console
    console.log("pagination:", pagination);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing examples:", error);
  }
})();
