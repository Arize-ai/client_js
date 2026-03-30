import { createClient } from "../client";
import { TaskRun, TaskRunStatus, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { fetchTaskRun } from "./internal";

const TERMINAL_STATUSES: TaskRunStatus[] = ["completed", "failed", "cancelled"];

const DEFAULT_POLL_INTERVAL_MS = 5_000; // 5 seconds
const DEFAULT_TIMEOUT_MS = 10 * 60 * 1_000; // 10 minutes

export type WaitForTaskRunParams = WithClient<{
  /**
   * The ID of the task run to wait for.
   */
  runId: string;
  /**
   * How often to poll for status updates, in milliseconds. Defaults to 5000ms.
   */
  pollInterval?: number;
  /**
   * Maximum time to wait before throwing a timeout error, in milliseconds.
   * Defaults to 600000ms (10 minutes).
   */
  timeout?: number;
}>;

/**
 * Poll a task run until it reaches a terminal status (`completed`, `failed`,
 * or `cancelled`), then return the final {@link TaskRun}.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param runId - The ID of the task run to wait for.
 * @param pollInterval - How often to poll, in milliseconds. Defaults to 5000.
 * @param timeout - Maximum wait time in milliseconds. Defaults to 600000 (10 min).
 * @returns The final {@link TaskRun} once it reaches a terminal status.
 * @throws Error if `timeout` or `pollInterval` is not positive.
 * @throws Error if the timeout is exceeded before the run finishes.
 * @example
 * ```typescript
 * import { triggerTaskRun, waitForTaskRun } from "@arizeai/ax-client"
 *
 * const run = await triggerTaskRun({ task: "your_task_id" });
 * const finalRun = await waitForTaskRun({
 *   runId: run.id,
 *   pollInterval: 3_000,  // poll every 3 seconds
 *   timeout: 5 * 60_000,  // give up after 5 minutes
 * });
 *
 * if (finalRun.status === "completed") {
 *   console.log(`${finalRun.numSuccesses} spans evaluated successfully`);
 * } else {
 *   console.error(`Run ended with status: ${finalRun.status}`);
 * }
 * ```
 */
export async function waitForTaskRun({
  client: clientInstance,
  runId,
  pollInterval = DEFAULT_POLL_INTERVAL_MS,
  timeout = DEFAULT_TIMEOUT_MS,
}: WaitForTaskRunParams): Promise<TaskRun> {
  warnPreRelease({ functionName: "waitForTaskRun" });
  if (timeout <= 0) {
    throw new Error(`timeout must be positive, got ${timeout}`);
  }
  if (pollInterval <= 0) {
    throw new Error(`pollInterval must be positive, got ${pollInterval}`);
  }
  const client = clientInstance ?? createClient();
  const deadline = Date.now() + timeout;

  // Call fetchTaskRun directly (not getTaskRun) to avoid re-triggering
  // the pre-release warning on every poll iteration.
  const initial = await fetchTaskRun(client, runId);
  if (TERMINAL_STATUSES.includes(initial.status)) {
    return initial;
  }

  return new Promise((resolve, reject) => {
    let lastStatus = initial.status;
    const handle = setInterval(async () => {
      if (Date.now() >= deadline) {
        clearInterval(handle);
        reject(
          new Error(
            `waitForTaskRun timed out after ${timeout}ms. Last status: "${lastStatus}"`,
          ),
        );
        return;
      }
      const run = await fetchTaskRun(client, runId);
      lastStatus = run.status;
      if (TERMINAL_STATUSES.includes(run.status)) {
        clearInterval(handle);
        resolve(run);
      }
    }, pollInterval);
  });
}
