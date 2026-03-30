import { listTasks } from "../src/tasks";

(async () => {
  try {
    const tasks = await listTasks({
      space: "your_space_name",
      project: "your_project_name",
    });
    // eslint-disable-next-line no-console
    console.log(tasks);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing tasks:", error);
  }
})();
