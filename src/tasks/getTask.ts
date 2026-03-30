import { createClient } from "../client";
import { Task, WithClient } from "../types";
import { toSpaceRef, findTaskId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformTask } from "./utils";

export type GetTaskParams = WithClient<{
  /**
   * The task name or ID.
   */
  task: string;
  /**
   * The space name or ID. Required when `task` is a name.
   */
  space?: string;
}>;

/**
 * Get the information about a specific task.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param task - The task name or ID.
 * @param space - The space name or ID. Required when `task` is a name.
 * @returns A {@link Task}.
 * @throws Error if the task cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getTask } from "@arizeai/ax-client"
 *
 * // By ID
 * const task = await getTask({ task: "your_task_id" });
 *
 * // By name (requires space)
 * const task = await getTask({ task: "My Task", space: "my-space" });
 * console.log(task);
 * ```
 */
export async function getTask({
  client: clientInstance,
  task,
  space,
}: GetTaskParams): Promise<Task> {
  warnPreRelease({ functionName: "getTask" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const taskId = await findTaskId(client, task, spaceRef);
  const response = await client.GET("/v2/tasks/{task_id}", {
    params: {
      path: {
        task_id: taskId,
      },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformTask(response.data);
}
