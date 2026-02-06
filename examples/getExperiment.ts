import { getExperiment } from "../src/experiments";

(async () => {
  try {
    const experiment = await getExperiment({
      experimentId: "your_experiment_id",
    });
    // eslint-disable-next-line no-console
    console.log(experiment);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting experiment:", error);
  }
})();
