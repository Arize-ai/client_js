import { deleteTask } from "../src/tasks";

(async () => {
  try {
    await deleteTask({
      task: "your_task_id_or_name",
      space: "your_space_name",
    });
    // eslint-disable-next-line no-console
    console.log("Task deleted.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting task:", error);
  }
})();
