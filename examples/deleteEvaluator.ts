import { deleteEvaluator } from "../src/evaluators";

(async () => {
  try {
    await deleteEvaluator({ evaluatorId: "your_evaluator_id" });
    // eslint-disable-next-line no-console
    console.log("Evaluator deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting evaluator:", error);
  }
})();
