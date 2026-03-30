import { createClient } from "../client";
import { CreateTaskInput, Task, WithClient } from "../types";
import { findDatasetId, findProjectId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { toRawTaskEvaluator, transformTask } from "./utils";

export type CreateTaskParams = WithClient<CreateTaskInput>;

/**
 * Create a new evaluation task.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The display name of the task.
 * @param type - The task type ("template_evaluation" | "code_evaluation").
 * @param evaluators - The evaluators to configure for this task.
 * @param space - The space name or ID. Required when `project` or `dataset` is a name.
 * @param project - The project name or ID to monitor (mutually exclusive with dataset).
 * @param dataset - The dataset name or ID to evaluate (mutually exclusive with project).
 * @param isContinuous - Whether the task runs continuously on new project data.
 * @param samplingRate - Fraction of spans to sample (project-scoped continuous tasks only).
 * @param queryFilter - An optional filter applied before any evaluator runs.
 * @returns A created {@link Task}.
 * @throws Error if the task cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createTask, triggerTaskRun, waitForTaskRun } from "@arizeai/ax-client"
 *
 * // Create the task (using names instead of IDs)
 * const task = await createTask({
 *   name: "Weekly Quality Check",
 *   type: "template_evaluation",
 *   space: "my-space",
 *   project: "my-project",
 *   evaluators: [
 *     {
 *       evaluatorId: "your_evaluator_id",
 *       columnMappings: { input: "question", output: "answer" },
 *     },
 *   ],
 * });
 *
 * // Immediately trigger a run and wait for it to finish
 * const run = await triggerTaskRun({ task: task.id });
 * const finalRun = await waitForTaskRun({ runId: run.id });
 * console.log(finalRun.status); // "completed" | "failed" | "cancelled"
 * ```
 */
export async function createTask({
  client: clientInstance,
  name,
  type,
  evaluators,
  space,
  project,
  dataset,
  experimentIds,
  isContinuous,
  samplingRate,
  queryFilter,
}: CreateTaskParams): Promise<Task> {
  warnPreRelease({ functionName: "createTask" });
  const client = clientInstance ?? createClient();

  const spaceRef = toSpaceRef(space);
  const resolvedProjectId = project
    ? await findProjectId(client, project, spaceRef)
    : undefined;
  const resolvedDatasetId = dataset
    ? await findDatasetId(client, dataset, spaceRef)
    : undefined;

  const response = await client.POST("/v2/tasks", {
    body: {
      name,
      type,
      project_id: resolvedProjectId,
      dataset_id: resolvedDatasetId,
      is_continuous: isContinuous,
      sampling_rate: samplingRate,
      experiment_ids: experimentIds,
      query_filter: queryFilter,
      evaluators: evaluators.map(toRawTaskEvaluator),
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformTask(response.data);
}
