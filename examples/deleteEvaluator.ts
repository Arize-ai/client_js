import { deleteEvaluator } from "../src/evaluators";

(async () => {
  try {
    await deleteEvaluator({
      space: "your_space_name",
      evaluator: "your_evaluator_name",
    });
    // eslint-disable-next-line no-console
    console.log("Evaluator deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting evaluator:", error);
  }
})();
