import { updateExamples } from "../src/datasets/updateExamples";
(async () => {
  try {
    const dataset = await updateExamples({
      space: "your_space_name",
      dataset: "your_dataset_name",
      examples: [
        {
          id: "your_example_id",
          question: "What is 2+2?",
          answer: "4",
          topic: "math",
        },
      ],
    });
    // eslint-disable-next-line no-console
    console.log(dataset);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
