import { CreateEvaluationTaskInput, Task, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { createTask } from "./createTask";

export type CreateEvaluationTaskParams = WithClient<CreateEvaluationTaskInput>;

const EVAL_TASK_TYPES = new Set(["TEMPLATE_EVALUATION", "CODE_EVALUATION"]);

/**
 * Create a new evaluation task (`TEMPLATE_EVALUATION` or `CODE_EVALUATION`).
 *
 * Exactly one of `project` (for online project monitoring) or `dataset`
 * (for offline batch evaluation) must be provided — they are mutually exclusive.
 * `isContinuous` and `samplingRate` are only valid for project-scoped tasks.
 *
 * For `RUN_EXPERIMENT` tasks use {@link createRunExperimentTask} instead.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The display name of the task.
 * @param type - The task type (`"TEMPLATE_EVALUATION"` or `"CODE_EVALUATION"`).
 * @param evaluators - The evaluators to configure for this task.
 * @param space - The space name or ID. Required when `project` or `dataset` is a name.
 * @param project - The project name or ID to monitor (mutually exclusive with `dataset`).
 * @param dataset - The dataset name or ID to evaluate (mutually exclusive with `project`).
 * @param experimentIds - Experiment IDs to scope this task to (dataset-scoped tasks only).
 * @param isContinuous - Whether the task runs continuously on new project data.
 * @param samplingRate - Fraction of spans to sample (project-scoped continuous tasks only).
 * @param queryFilter - An optional filter applied before any evaluator runs.
 * @returns A created {@link Task}.
 * @throws Error if an unsupported task type is provided or the task cannot be created.
 * @example
 * ```typescript
 * import { createEvaluationTask, triggerTaskRun, waitForTaskRun } from "@arizeai/ax-client"
 *
 * const task = await createEvaluationTask({
 *   name: "Weekly Quality Check",
 *   type: "TEMPLATE_EVALUATION",
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
 * const run = await triggerTaskRun({ task: task.id });
 * const finalRun = await waitForTaskRun({ runId: run.id });
 * console.log(finalRun.status); // "COMPLETED" | "FAILED" | "CANCELLED"
 * ```
 */
export async function createEvaluationTask({
  client,
  type,
  ...rest
}: CreateEvaluationTaskParams): Promise<Task> {
  warnPreRelease({ functionName: "createEvaluationTask", stage: "beta" });

  if (!EVAL_TASK_TYPES.has(type)) {
    throw new Error(
      `createEvaluationTask only supports evaluation task types ("TEMPLATE_EVALUATION", "CODE_EVALUATION"). ` +
        `Got "${type}". Use createRunExperimentTask for RUN_EXPERIMENT tasks.`,
    );
  }

  return createTask({ client, type, ...rest });
}
