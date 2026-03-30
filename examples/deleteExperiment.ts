import { deleteExperiment } from "../src/experiments";

(async () => {
  try {
    await deleteExperiment({
      space: "your_space_name",
      dataset: "your_dataset_name",
      experiment: "your_experiment_name",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting experiment:", error);
  }
})();
