import { createClient } from "../client";
import { PaginatedResponse, PaginationParams, WithClient } from "../types";
import { Project } from "../types/projects";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { resolveSpace } from "../utils/space";
import { transformProject } from "./utils";

export type ListProjectsParams = WithClient<
  PaginationParams & {
    /**
     * Optional space filter. If the value is a base64-encoded resource ID
     * (e.g. `"U3BhY2U6YWJjMTIz"`) it is treated as a space ID; otherwise it
     * is used as a case-insensitive substring filter on the space name.
     */
    space?: string;
    /** Case-insensitive substring filter on the project name. */
    name?: string;
  }
>;

/**
 * List the information about all projects available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - An optional space filter. Pass a base64-encoded space ID (e.g. `"U3BhY2U6YWJjMTIz"`) or a space name for substring filtering.
 * @param name - An optional case-insensitive substring filter on the project name.
 * @param limit - An optional limit on the number of projects to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link Project} objects.
 * @throws Error if the projects cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listProjects } from "@arizeai/ax-client"
 *
 * const projects = await listProjects({ space: "my-space" });
 * console.log(projects);
 * ```
 */
export async function listProjects(
  params: ListProjectsParams = {},
): Promise<PaginatedResponse<Project>> {
  warnPreRelease({ functionName: "listProjects", stage: "beta" });
  const {
    client: clientInstance,
    space,
    name,
    limit = DEFAULT_LIST_LIMIT,
    cursor,
  } = params;
  const { spaceId, spaceName } = resolveSpace(space);
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/projects", {
    params: {
      query: {
        space_id: spaceId,
        space_name: spaceName,
        name,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.projects.map(transformProject),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
