import { updateEvaluator } from "../src/evaluators";

(async () => {
  try {
    const evaluator = await updateEvaluator({
      space: "your_space_name",
      evaluator: "your_evaluator_name",
      name: "Updated Evaluator Name",
    });
    // eslint-disable-next-line no-console
    console.dir(evaluator, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating evaluator:", error);
  }
})();
