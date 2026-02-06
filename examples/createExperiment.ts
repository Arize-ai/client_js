import { createExperiment } from "../src/experiments";

(async () => {
  try {
    const experiment = await createExperiment({
      experimentName: "your_experiment_name",
      datasetId: "your_dataset_id",
      experimentRuns: [
        {
          exampleId: "your_example_id",
          output: "output",
        },
      ],
    });
    // eslint-disable-next-line no-console
    console.log(experiment);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating experiment:", error);
  }
})();
