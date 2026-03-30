import { listEvaluatorVersions } from "../src/evaluators";

const EVALUATOR_VERSION_LIMIT = 5;

(async () => {
  try {
    const versions = await listEvaluatorVersions({
      space: "your_space_name",
      evaluator: "your_evaluator_name",
      limit: EVALUATOR_VERSION_LIMIT,
    });
    // eslint-disable-next-line no-console
    console.dir(versions, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing evaluator versions:", error);
  }
})();
