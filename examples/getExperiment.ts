import { getExperiment } from "../src/experiments";

(async () => {
  try {
    const experiment = await getExperiment({
      space: "your_space_name",
      dataset: "your_dataset_name",
      experiment: "your_experiment_name",
    });
    // eslint-disable-next-line no-console
    console.log(experiment);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting experiment:", error);
  }
})();
