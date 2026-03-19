import { listEvaluatorVersions } from "../src/evaluators";

const EVALUATOR_VERSION_LIMIT = 5;

(async () => {
  try {
    const versions = await listEvaluatorVersions({
      evaluatorId: "your_evaluator_id",
      limit: EVALUATOR_VERSION_LIMIT,
    });
    // eslint-disable-next-line no-console
    console.dir(versions, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing evaluator versions:", error);
  }
})();
