import { triggerTaskRun } from "../src/tasks";

(async () => {
  try {
    const run = await triggerTaskRun({
      space: "your_space_name",
      task: "your_task_name",
      dataStartTime: new Date("2026-03-09T00:00:00Z"),
      dataEndTime: new Date("2026-03-10T00:00:00Z"),
    });
    // eslint-disable-next-line no-console
    console.log(run);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error triggering task run:", error);
  }
})();
