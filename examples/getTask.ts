import { getTask } from "../src/tasks";

(async () => {
  try {
    const task = await getTask({
      space: "your_space_name",
      task: "your_task_name",
    });
    // eslint-disable-next-line no-console
    console.log(task);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting task:", error);
  }
})();
