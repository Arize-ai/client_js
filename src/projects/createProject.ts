import { createClient } from "../client";
import { Project, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformProject } from "./utils";

export type CreateProjectParams = WithClient<{
  name: string;
  spaceId: string;
}>;

/**
 * Create a new project.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @spaceId - The space ID to create the project in.
 * @name - The name of the project to create.
 * @returns A {@link Project}.
 * @throws Error if the project cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createProject } from "@arizeai/ax-client"
 *
 * const project = await createProject({
 *   spaceId: "your_space_id",
 *   name: "your_project_name",
 * });
 * console.log(project);
 * ```
 */
export async function createProject({
  client: clientInstance,
  name,
  spaceId,
}: CreateProjectParams): Promise<Project> {
  warnPreRelease({ functionName: "createProject" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/projects", {
    body: {
      name,
      space_id: spaceId,
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformProject(response.data);
}
