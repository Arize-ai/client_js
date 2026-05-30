import { CreateEvaluationTaskInput, Task, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { createTask } from "./createTask";

export type CreateEvaluationTaskParams = WithClient<CreateEvaluationTaskInput>;

const EVAL_TASK_TYPES = new Set(["template_evaluation", "code_evaluation"]);

/**
 * Create a new evaluation task (`template_evaluation` or `code_evaluation`).
 *
 * Exactly one of `project` (for online project monitoring) or `dataset`
 * (for offline batch evaluation) must be provided — they are mutually exclusive.
 * `isContinuous` and `samplingRate` are only valid for project-scoped tasks.
 *
 * For `run_experiment` tasks use {@link createRunExperimentTask} instead.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The display name of the task.
 * @param type - The task type (`"template_evaluation"` or `"code_evaluation"`).
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
 * const run = await triggerTaskRun({ task: task.id });
 * const finalRun = await waitForTaskRun({ runId: run.id });
 * console.log(finalRun.status); // "completed" | "failed" | "cancelled"
 * ```
 */
export async function createEvaluationTask({
  client,
  type,
  ...rest
}: CreateEvaluationTaskParams): Promise<Task> {
  warnPreRelease({ functionName: "createEvaluationTask", stage: "alpha" });

  if (!EVAL_TASK_TYPES.has(type)) {
    throw new Error(
      `createEvaluationTask only supports evaluation task types ("template_evaluation", "code_evaluation"). ` +
        `Got "${type}". Use createRunExperimentTask for run_experiment tasks.`,
    );
  }

  return createTask({ client, type, ...rest });
}
