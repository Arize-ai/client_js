import { createClient } from "../client";
import { PaginatedResponse, PaginationParams, WithClient } from "../types";
import { Project } from "../types/projects";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { transformProject } from "./utils";

export type ListProjectsParams = WithClient<
  PaginationParams & {
    spaceId?: string;
  }
>;

/**
 * List the information about all projects available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - An optional base64 encoded space ID used to filter projects in a specific space.
 * @param limit - An optional limit on the number of projects to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link Project} objects.
 * @throws Error if the projects cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listProjects } from "@arizeai/ax-client"
 *
 * const projects = await listProjects();
 * console.log(projects);
 * ```
 */
export async function listProjects(
  params: ListProjectsParams = {},
): Promise<PaginatedResponse<Project>> {
  warnPreRelease({ functionName: "listProjects" });
  const { client: clientInstance, spaceId, limit, cursor } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/projects", {
    params: {
      query: {
        space_id: spaceId,
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
    data: response.data.projects.map(transformProject),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
