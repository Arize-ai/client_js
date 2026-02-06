import { listExperiments } from "../src/experiments";

const EXPERIMENT_LIMIT = 5;

(async () => {
  try {
    const experiments = await listExperiments({ limit: EXPERIMENT_LIMIT });
    // eslint-disable-next-line no-console
    console.log(experiments);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing experiments:", error);
  }
})();
