import { getEvaluator } from "../src/evaluators";

(async () => {
  try {
    const evaluator = await getEvaluator({
      evaluatorId: "your_evaluator_id",
    });
    // eslint-disable-next-line no-console
    console.dir(evaluator, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting evaluator:", error);
  }
})();
