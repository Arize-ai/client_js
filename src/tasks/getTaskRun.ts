import { createClient } from "../client";
import { TaskRun, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { fetchTaskRun } from "./internal";

export type GetTaskRunParams = WithClient<{
  /**
   * The ID of the task run to get.
   */
  runId: string;
}>;

/**
 * Get the information about a specific task run.
 *
 * To wait for a run to finish rather than fetching a single snapshot, use
 * {@link waitForTaskRun} instead.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param runId - The ID of the task run to get.
 * @returns A {@link TaskRun}.
 * @throws Error if the task run cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getTaskRun } from "@arizeai/ax-client"
 *
 * const run = await getTaskRun({ runId: "your_run_id" });
 * console.log(run.status);        // e.g. "RUNNING"
 * console.log(run.numSuccesses);  // spans evaluated so far
 * ```
 */
export async function getTaskRun({
  client: clientInstance,
  runId,
}: GetTaskRunParams): Promise<TaskRun> {
  warnPreRelease({ functionName: "getTaskRun", stage: "beta" });
  const client = clientInstance ?? createClient();
  return fetchTaskRun(client, runId);
}
