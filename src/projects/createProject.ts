import { createClient } from "../client";
import { Project, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformProject } from "./utils";
import { findSpaceId } from "../utils/resolve";

export type CreateProjectParams = WithClient<{
  name: string;
  /** Space ID or name. */
  space: string;
}>;

/**
 * Create a new project.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - The space ID or name to create the project in.
 * @param name - The name of the project to create.
 * @returns A {@link Project}.
 * @throws Error if the project cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createProject } from "@arizeai/ax-client"
 *
 * const project = await createProject({
 *   space: "my-space",
 *   name: "your_project_name",
 * });
 * console.log(project);
 * ```
 */
export async function createProject({
  client: clientInstance,
  name,
  space,
}: CreateProjectParams): Promise<Project> {
  warnPreRelease({ functionName: "createProject", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, space);
  const response = await client.POST("/v2/projects", {
    body: {
      name,
      space_id: spaceId,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformProject(response.data);
}
