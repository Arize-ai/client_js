import { appendExperimentRuns } from "../src/experiments";

(async () => {
  try {
    const result = await appendExperimentRuns({
      space: "your_space_name_or_id",
      dataset: "your_dataset_name",
      experiment: "your_experiment_name",
      experimentRuns: [
        { exampleId: "your_example_id_1", output: "The answer is 42" },
        { exampleId: "your_example_id_2", output: "Paris" },
      ],
    });
    // eslint-disable-next-line no-console
    console.dir(result, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
