import { listExperimentRuns } from "../src/experiments";

const EXPERIMENT_RUN_LIMIT = 5;

(async () => {
  try {
    const experimentRuns = await listExperimentRuns({
      experimentId: "your_experiment_id",
      limit: EXPERIMENT_RUN_LIMIT,
    });
    // eslint-disable-next-line no-console
    console.log(experimentRuns);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing experiment runs:", error);
  }
})();
