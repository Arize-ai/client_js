import { createClient } from "../client";
import { Task, UpdateTaskInput, WithClient } from "../types";
import { findTaskId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { toRawTaskEvaluator, transformTask } from "./utils";

export type UpdateTaskParams = WithClient<
  UpdateTaskInput & {
    /**
     * The task name or global ID (base64) to update.
     */
    task: string;
    /**
     * Space name or ID used when resolving `task` by name.
     */
    space?: string;
  }
>;

/**
 * Update mutable fields on an existing evaluation task.
 *
 * At least one mutable field must be provided. Pass `queryFilter: null` to
 * clear the task-level query filter.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param task - Task name or ID.
 * @param space - Space when resolving by task name.
 * @param name - An optional new display name for the task.
 * @param samplingRate - Optional new sampling rate (project-scoped tasks only).
 * @param isContinuous - Whether the task runs continuously (project-scoped tasks only).
 * @param queryFilter - Task-level query filter. Pass `null` to clear.
 * @param evaluators - Replaces the entire evaluator list (requires at least one entry).
 * @returns The updated {@link Task}.
 * @throws Error if no update fields were provided or the API request fails.
 */
export async function updateTask({
  client: clientInstance,
  task,
  space,
  name,
  samplingRate,
  isContinuous,
  queryFilter,
  evaluators,
}: UpdateTaskParams): Promise<Task> {
  warnPreRelease({ functionName: "updateTask", stage: "beta" });

  if (
    name === undefined &&
    samplingRate === undefined &&
    isContinuous === undefined &&
    queryFilter === undefined &&
    evaluators === undefined
  ) {
    throw new Error(
      "At least one update field must be provided (name, samplingRate, isContinuous, queryFilter, or evaluators).",
    );
  }

  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const taskId = await findTaskId(client, task, spaceRef);

  const response = await client.PATCH("/v2/tasks/{task_id}", {
    params: {
      path: {
        task_id: taskId,
      },
    },
    body: {
      name,
      sampling_rate: samplingRate,
      is_continuous: isContinuous,
      query_filter: queryFilter,
      evaluators: evaluators?.map(toRawTaskEvaluator),
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformTask(response.data);
}
