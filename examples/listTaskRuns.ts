import { listTaskRuns } from "../src/tasks";

(async () => {
  try {
    const runs = await listTaskRuns({
      space: "your_space_name",
      task: "your_task_name",
    });
    // eslint-disable-next-line no-console
    console.log(runs);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing task runs:", error);
  }
})();
