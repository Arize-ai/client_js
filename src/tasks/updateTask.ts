import { createClient } from "../client";
import { Task, UpdateTaskInput, WithClient } from "../types";
import { findTaskId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { toRawQueryFilters, toRawTaskEvaluator, transformTask } from "./utils";

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
 * clear the task-level filter, or `queryFilters: null` to clear the
 * trace/session query filters.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param task - Task name or ID.
 * @param space - Space when resolving by task name.
 * @param name - An optional new display name for the task.
 * @param samplingRate - Optional new sampling rate (project-scoped tasks only).
 * @param isContinuous - Whether the task runs continuously (project-scoped tasks only).
 * @param queryFilter - Task-level query filter (span shape). Pass `null` to clear. Mutually exclusive with `queryFilters`.
 * @param queryFilters - Combined named query filters + expression (trace/session shape). Pass `null` to clear. Mutually exclusive with `queryFilter`.
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
  queryFilters,
  evaluators,
}: UpdateTaskParams): Promise<Task> {
  warnPreRelease({ functionName: "updateTask", stage: "beta" });

  if (
    name === undefined &&
    samplingRate === undefined &&
    isContinuous === undefined &&
    queryFilter === undefined &&
    queryFilters === undefined &&
    evaluators === undefined
  ) {
    throw new Error(
      "At least one update field must be provided (name, samplingRate, isContinuous, queryFilter, queryFilters, or evaluators).",
    );
  }

  if (
    queryFilter !== undefined &&
    queryFilter !== null &&
    queryFilters !== undefined &&
    queryFilters !== null
  ) {
    throw new Error(
      "queryFilter and queryFilters are mutually exclusive; provide one or the other.",
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
      query_filters:
        queryFilters === undefined
          ? undefined
          : queryFilters === null
            ? null
            : {
                filters: toRawQueryFilters(queryFilters.filters),
                expression: queryFilters.expression ?? undefined,
              },
      evaluators: evaluators?.map(toRawTaskEvaluator),
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformTask(response.data);
}
