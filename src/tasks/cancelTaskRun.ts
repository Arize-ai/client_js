import { createClient } from "../client";
import { TaskRun, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformTaskRun } from "./utils";

export type CancelTaskRunParams = WithClient<{
  /**
   * The ID of the task run to cancel.
   */
  runId: string;
}>;

/**
 * Cancel a task run that is pending or running.
 *
 * Only valid when the run's current status is `pending` or `running`. Calling
 * this on a run that is already in a terminal state (`completed`, `failed`, or
 * `cancelled`) will result in an error from the API.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param runId - The ID of the task run to cancel.
 * @returns The updated {@link TaskRun} reflecting the cancelled state.
 * @throws Error if the cancel request fails or the response is invalid.
 * @example
 * ```typescript
 * import { cancelTaskRun } from "@arizeai/ax-client"
 *
 * const run = await cancelTaskRun({ runId: "your_run_id" });
 * console.log(run.status); // "cancelled"
 * ```
 */
export async function cancelTaskRun({
  client: clientInstance,
  runId,
}: CancelTaskRunParams): Promise<TaskRun> {
  warnPreRelease({ functionName: "cancelTaskRun", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/task-runs/{run_id}/cancel", {
    params: {
      path: {
        run_id: runId,
      },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformTaskRun(response.data);
}
