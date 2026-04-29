import { annotateExperimentRuns } from "../src/experiments/annotateExperimentRuns";

(async () => {
  try {
    const result = await annotateExperimentRuns({
      space: "your_space_name_or_id",
      dataset: "your_dataset_name",
      experiment: "your_experiment_name",
      annotations: [
        {
          recordId: "your_run_id",
          values: [
            { name: "accuracy", label: "correct", score: 1.0 },
            { name: "notes", text: "Well-structured output" },
          ],
        },
        {
          recordId: "another_run_id",
          values: [{ name: "accuracy", label: "incorrect", score: 0.0 }],
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
