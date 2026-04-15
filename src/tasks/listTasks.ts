import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  Task,
  TaskType,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { resolveSpace } from "../utils/space";
import { findProjectId, findDatasetId } from "../utils/resolve";
import { transformTask } from "./utils";

/**
 * Parameters for the listTasks function.
 */
export type ListTasksParams = WithClient<
  PaginationParams & {
    /**
     * Optional space filter. If the value starts with `"spc_"` it is treated
     * as a space ID; otherwise it is used as a case-insensitive substring
     * filter on the space name.
     */
    space?: string;
    /** Case-insensitive substring filter on the task name. */
    name?: string;
    /** Project ID or name to filter tasks. */
    project?: string;
    /** Dataset ID or name to filter tasks. */
    dataset?: string;
    type?: TaskType;
  }
>;

/**
 * List tasks available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - An optional space filter. Pass a space ID or name.
 * @param name - An optional case-insensitive substring filter on the task name.
 * @param project - An optional project ID or name to filter tasks.
 * @param dataset - An optional dataset ID or name to filter tasks.
 * @param type - An optional task type filter ("template_evaluation" | "code_evaluation").
 * @param limit - An optional limit on the number of tasks to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link Task} objects.
 * @throws Error if the tasks cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listTasks } from "@arizeai/ax-client"
 *
 * const tasks = await listTasks({ space: "my-space", name: "prod" });
 * console.log(tasks);
 * ```
 */
export async function listTasks(
  params: ListTasksParams = {},
): Promise<PaginatedResponse<Task>> {
  warnPreRelease({ functionName: "listTasks" });
  const {
    client: clientInstance,
    space,
    name,
    project,
    dataset,
    type,
    limit,
    cursor,
  } = params;
  const { spaceId: filterSpaceId, spaceName } = resolveSpace(space);
  const client = clientInstance ?? createClient();
  const spaceRef = { spaceId: filterSpaceId, spaceName };
  const projectId = project
    ? await findProjectId(client, project, spaceRef)
    : undefined;
  const datasetId = dataset
    ? await findDatasetId(client, dataset, spaceRef)
    : undefined;
  const response = await client.GET("/v2/tasks", {
    params: {
      query: {
        space_id: filterSpaceId,
        space_name: spaceName,
        name,
        project_id: projectId,
        dataset_id: datasetId,
        type,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.tasks.map(transformTask),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
