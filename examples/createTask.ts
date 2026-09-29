import { createTask } from "../src/tasks";

// Span-granularity task: evaluators use columnMappings and an optional queryFilter.
(async () => {
  try {
    const task = await createTask({
      name: "Weekly Quality Check",
      type: "TEMPLATE_EVALUATION",
      space: "your_space_name",
      project: "your_project_name",
      queryFilter: "span_kind = 'LLM'",
      evaluators: [
        {
          evaluatorId: "your_evaluator_id",
          columnMappings: {
            input: "attributes.input.value",
            output: "attributes.output.value",
          },
        },
      ],
    });
    // eslint-disable-next-line no-console
    console.log(task);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating span task:", error);
  }
})();

// Trace/session-granularity task (multi-span query): evaluators use queryMappings
// and the task uses queryFilters with a boolean expression.
(async () => {
  try {
    const task = await createTask({
      name: "Trace Quality Check",
      type: "TEMPLATE_EVALUATION",
      space: "your_space_name",
      project: "your_project_name",
      queryFilters: {
        filters: [
          { id: "A", filter: "span_kind = 'LLM'" },
          { id: "B", filter: "span_kind = 'RETRIEVER'" },
        ],
        expression: "A AND B",
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
            {
              variableName: "output",
              queryIds: ["B"],
              attributePath: "attributes.output.value",
            },
          ],
        },
      ],
    });
    // eslint-disable-next-line no-console
    console.log(task);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating trace task:", error);
  }
})();
