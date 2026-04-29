import { annotateDatasetExamples } from "../src/datasets/annotateDatasetExamples";

(async () => {
  try {
    const result = await annotateDatasetExamples({
      space: "your_space_name_or_id",
      dataset: "your_dataset_name",
      annotations: [
        {
          recordId: "your_example_id",
          values: [
            { name: "quality", score: 0.9 },
            { name: "topic", label: "science" },
          ],
        },
        {
          recordId: "another_example_id",
          values: [{ name: "notes", text: "Needs more detail" }],
        },
      ],
    });
    // eslint-disable-next-line no-console
    console.dir(result, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
