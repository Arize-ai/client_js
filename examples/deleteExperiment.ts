import { deleteExperiment } from "../src/experiments";

(async () => {
  try {
    await deleteExperiment({
      experimentId: "your_experiment_id",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting experiment:", error);
  }
})();
