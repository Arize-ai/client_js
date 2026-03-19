import { listEvaluators } from "../src/evaluators";

const EVALUATOR_LIMIT = 5;

(async () => {
  try {
    const evaluators = await listEvaluators({
      limit: EVALUATOR_LIMIT,
    });
    // eslint-disable-next-line no-console
    console.dir(evaluators, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing evaluators:", error);
  }
})();
