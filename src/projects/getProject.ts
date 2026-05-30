import { createClient } from "../client";
import { Project, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformProject } from "./utils";
import { toSpaceRef, findProjectId } from "../utils/resolve";

export type GetProjectParams = WithClient<{
  /** Project ID or name. */
  project: string;
  /** Space ID or name. Required when `project` is a name. */
  space?: string;
}>;

/**
 * Get the information about a specific project available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param project - The project ID or name.
 * @param space - The space ID or name. Required when `project` is a name.
 * @returns A {@link Project}.
 * @throws Error if the project cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getProject } from "@arizeai/ax-client"
 *
 * const project = await getProject({ project: "my-project", space: "my-space" });
 * console.log(project);
 * ```
 */
export async function getProject({
  client: clientInstance,
  project,
  space,
}: GetProjectParams): Promise<Project> {
  warnPreRelease({ functionName: "getProject", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const projectId = await findProjectId(client, project, spaceRef);
  const response = await client.GET("/v2/projects/{project_id}", {
    params: {
      path: {
        project_id: projectId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformProject(response.data);
}
