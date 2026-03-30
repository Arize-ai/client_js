import { createClient } from "../client";
import { TaskRun } from "../types";
import { transformTaskRun } from "./utils";

/**
 * Fetches a task run by ID without triggering the pre-release warning.
 * Shared between getTaskRun and waitForTaskRun to avoid re-triggering
 * the warning on every poll iteration.
 */
export async function fetchTaskRun(
  client: ReturnType<typeof createClient>,
  runId: string,
): Promise<TaskRun> {
  const response = await client.GET("/v2/task-runs/{run_id}", {
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
