import { createClient } from "../client";
import { WithClient } from "../types";
import { findTaskId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";

export type DeleteTaskParams = WithClient<{
  /**
   * The task name or global ID (base64) to delete.
   */
  task: string;
  /**
   * Space name or ID used when resolving `task` by name.
   */
  space?: string;
}>;

/**
 * Delete a task and its associated configuration.
 *
 * This operation is irreversible.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param task - Task name or ID.
 * @param space - Space when resolving by task name.
 * @throws Error if the API request fails.
 */
export async function deleteTask({
  client: clientInstance,
  task,
  space,
}: DeleteTaskParams): Promise<void> {
  warnPreRelease({ functionName: "deleteTask", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const taskId = await findTaskId(client, task, spaceRef);

  const response = await client.DELETE("/v2/tasks/{task_id}", {
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
}
