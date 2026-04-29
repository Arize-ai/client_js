import { updateTask } from "../src/tasks";

(async () => {
  try {
    const task = await updateTask({
      task: "your_task_id_or_name",
      space: "your_space_name",
      name: "Renamed Evaluation Task",
      samplingRate: 0.5,
    });
    // eslint-disable-next-line no-console
    console.log(task);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating task:", error);
  }
})();
