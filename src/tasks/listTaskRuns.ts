import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  TaskRun,
  TaskRunStatus,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { toSpaceRef, findTaskId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformTaskRun } from "./utils";

export type ListTaskRunsParams = WithClient<
  PaginationParams & {
    /**
     * The task name or ID.
     */
    task: string;
    /**
     * The space name or ID. Required when `task` is a name.
     */
    space?: string;
    /** Filter runs by status. */
    status?: TaskRunStatus;
  }
>;

/**
 * List runs for a specific task.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param task - The task name or ID.
 * @param space - The space name or ID. Required when `task` is a name.
 * @param status - An optional status filter.
 * @param limit - An optional limit on the number of runs to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link TaskRun} objects.
 * @throws Error if the runs cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listTaskRuns } from "@arizeai/ax-client"
 *
 * const { data: runs, pagination } = await listTaskRuns({
 *   task: "My Task",
 *   space: "my-space",
 *   status: "completed",
 *   limit: 10,
 * });
 *
 * for (const run of runs) {
 *   console.log(run.id, run.numSuccesses, run.numErrors);
 * }
 *
 * // Fetch the next page if available
 * if (pagination.nextCursor) {
 *   const next = await listTaskRuns({
 *     task: "My Task",
 *     space: "my-space",
 *     cursor: pagination.nextCursor,
 *   });
 * }
 * ```
 */
export async function listTaskRuns({
  client: clientInstance,
  task,
  space,
  status,
  limit = DEFAULT_LIST_LIMIT,
  cursor,
}: ListTaskRunsParams): Promise<PaginatedResponse<TaskRun>> {
  warnPreRelease({ functionName: "listTaskRuns", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const taskId = await findTaskId(client, task, spaceRef);
  const response = await client.GET("/v2/tasks/{task_id}/runs", {
    params: {
      path: {
        task_id: taskId,
      },
      query: {
        status,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return {
    data: response.data.task_runs.map(transformTaskRun),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
