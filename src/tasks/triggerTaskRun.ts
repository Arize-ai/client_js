import { createClient } from "../client";
import { TaskRun, TriggerTaskRunInput, WithClient } from "../types";
import { toSpaceRef, findTaskId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformTaskRun } from "./utils";

export type TriggerTaskRunParams = WithClient<
  TriggerTaskRunInput & {
    /**
     * The task name or ID.
     */
    task: string;
    /**
     * The space name or ID. Required when `task` is a name.
     */
    space?: string;
  }
>;

/**
 * Trigger a new run of a task.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param task - The task name or ID.
 * @param space - The space name or ID. Required when `task` is a name.
 * @param dataStartTime - Start of the data window to evaluate (Date). Defaults to 24h before dataEndTime.
 * @param dataEndTime - End of the data window to evaluate (Date). Defaults to now.
 * @param maxSpans - Maximum number of spans to evaluate. Defaults to 10000.
 * @param overrideEvaluations - Re-evaluate already-evaluated spans. Defaults to false.
 * @param experimentIds - Experiment IDs to evaluate. Only valid for dataset-scoped tasks; limits evaluation to spans belonging to these experiments.
 * @returns A created {@link TaskRun}.
 * @throws Error if the run cannot be triggered or the response is invalid.
 * @example
 * ```typescript
 * import { triggerTaskRun, waitForTaskRun } from "@arizeai/ax-client"
 *
 * const run = await triggerTaskRun({
 *   task: "My Task",
 *   space: "my-space",
 *   dataStartTime: new Date("2026-03-09T00:00:00Z"),
 *   dataEndTime: new Date("2026-03-10T00:00:00Z"),
 * });
 *
 * // Poll until the run finishes
 * const finalRun = await waitForTaskRun({ runId: run.id });
 * console.log(finalRun.status); // "completed" | "failed" | "cancelled"
 * ```
 */
export async function triggerTaskRun({
  client: clientInstance,
  task,
  space,
  dataStartTime,
  dataEndTime,
  maxSpans,
  overrideEvaluations,
  experimentIds,
}: TriggerTaskRunParams): Promise<TaskRun> {
  warnPreRelease({ functionName: "triggerTaskRun", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const taskId = await findTaskId(client, task, spaceRef);
  const response = await client.POST("/v2/tasks/{task_id}/trigger", {
    params: {
      path: {
        task_id: taskId,
      },
    },
    body: {
      data_start_time: dataStartTime?.toISOString(),
      data_end_time: dataEndTime?.toISOString(),
      max_spans: maxSpans,
      override_evaluations: overrideEvaluations,
      experiment_ids: experimentIds,
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformTaskRun(response.data);
}
