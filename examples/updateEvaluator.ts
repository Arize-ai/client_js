import { updateEvaluator } from "../src/evaluators";

(async () => {
  try {
    const evaluator = await updateEvaluator({
      evaluatorId: "your_evaluator_id",
      name: "Updated Evaluator Name",
    });
    // eslint-disable-next-line no-console
    console.dir(evaluator, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating evaluator:", error);
  }
})();
