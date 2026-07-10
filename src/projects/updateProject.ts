import { createClient } from "../client";
import { Project, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformProject } from "./utils";
import { findProjectId, toSpaceRef } from "../utils/resolve";

export type UpdateProjectParams = WithClient<{
  /**
   * The name or ID of the project to update.
   */
  project: string;
  /**
   * An optional space name or ID. Required when `project` is a name.
   */
  space?: string;
  /**
   * The new name for the project. Must be unique within the space.
   */
  name: string;
}>;

/**
 * Update an existing project.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param project - The name or ID of the project to update.
 * @param space - An optional space name or ID. Required when `project` is a name.
 * @param name - The new name for the project. Must be unique within the space.
 * @returns A {@link Project}.
 * @throws Error if the project cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateProject } from "@arizeai/ax-client"
 *
 * const project = await updateProject({
 *   project: "my-project",
 *   space: "my-space",
 *   name: "my-renamed-project",
 * });
 * console.log(project);
 * ```
 **/

export async function updateProject({
  client: clientInstance,
  project,
  name,
  space,
}: UpdateProjectParams): Promise<Project> {
  warnPreRelease({ functionName: "updateProject", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const projectId = await findProjectId(client, project, spaceRef);
  const response = await client.PATCH("/v2/projects/{project_id}", {
    params: {
      path: { project_id: projectId },
    },
    body: {
      name,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformProject(response.data);
}
