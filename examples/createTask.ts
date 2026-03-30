import { createTask } from "../src/tasks";

(async () => {
  try {
    const task = await createTask({
      name: "Weekly Quality Check",
      type: "template_evaluation",
      space: "your_space_name",
      project: "your_project_name",
      evaluators: [
        {
          evaluatorId: "your_evaluator_id",
          columnMappings: { input: "question", output: "answer" },
        },
      ],
    });
    // eslint-disable-next-line no-console
    console.log(task);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating task:", error);
  }
})();
