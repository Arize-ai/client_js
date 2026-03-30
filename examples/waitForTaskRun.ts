import { triggerTaskRun, waitForTaskRun } from "../src/tasks";

(async () => {
  try {
    const run = await triggerTaskRun({
      taskId: "your_task_id",
      dataStartTime: new Date("2026-03-09T00:00:00Z"),
      dataEndTime: new Date("2026-03-10T00:00:00Z"),
    });

    const finalRun = await waitForTaskRun({
      runId: run.id,
      pollInterval: 3_000, // poll every 3 seconds
      timeout: 5 * 60_000, // give up after 5 minutes
    });

    if (finalRun.status === "completed") {
      // eslint-disable-next-line no-console
      console.log(
        `Run completed: ${finalRun.numSuccesses} successes, ${finalRun.numErrors} errors`,
      );
    } else {
      // eslint-disable-next-line no-console
      console.error(`Run ended with status: ${finalRun.status}`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error waiting for task run:", error);
  }
})();
