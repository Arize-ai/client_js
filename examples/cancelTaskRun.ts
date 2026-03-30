import { cancelTaskRun } from "../src/tasks";

(async () => {
  try {
    await cancelTaskRun({
      runId: "your_run_id",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error cancelling task run:", error);
  }
})();
