import { createClient } from "../client";
import { Project, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformProject } from "./utils";

export type GetProjectParams = WithClient<{
  projectId: string;
}>;

/**
 * Get the information about a specific project available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param projectId - The ID of the project to get.
 * @returns A {@link Project}.
 * @throws Error if the project cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getProject } from "@arizeai/ax-client"
 *
 * const project = await getProject({ projectId: "your_project_id" });
 * console.log(project);
 * ```
 */
export async function getProject({
  client: clientInstance,
  projectId,
}: GetProjectParams): Promise<Project> {
  warnPreRelease({ functionName: "getProject" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/projects/{project_id}", {
    params: {
      path: {
        project_id: projectId,
      },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformProject(response.data);
}
