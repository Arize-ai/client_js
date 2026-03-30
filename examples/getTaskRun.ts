import { getTaskRun } from "../src/tasks";

(async () => {
  try {
    const run = await getTaskRun({
      runId: "your_run_id",
    });
    // eslint-disable-next-line no-console
    console.log(run);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting task run:", error);
  }
})();
