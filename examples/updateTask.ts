import { updateTask } from "../src/tasks";

// Update basic fields on a span-granularity task.
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

// Update a task to use the trace/session shape (multi-span query).
(async () => {
  try {
    const task = await updateTask({
      task: "your_task_id_or_name",
      space: "your_space_name",
      queryFilters: {
        filters: [{ id: "A", filter: "span_kind = 'LLM'" }],
        expression: "A",
      },
      evaluators: [
        {
          evaluatorId: "your_evaluator_id",
          queryMappings: [
            {
              variableName: "input",
              queryIds: ["A"],
              attributePath: "attributes.input.value",
            },
          ],
        },
      ],
    });
    // eslint-disable-next-line no-console
    console.log(task);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating task to MSQ shape:", error);
  }
})();
