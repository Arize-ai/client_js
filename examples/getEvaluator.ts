import { getEvaluator } from "../src/evaluators";

(async () => {
  try {
    const evaluator = await getEvaluator({
      space: "your_space_name",
      evaluator: "your_evaluator_name",
    });
    // eslint-disable-next-line no-console
    console.dir(evaluator, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting evaluator:", error);
  }
})();
