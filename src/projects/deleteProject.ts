import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { toSpaceRef, findProjectId } from "../utils/resolve";

export type DeleteProjectParams = WithClient<{
  /** Project ID or name. */
  project: string;
  /** Space ID or name. Required when `project` is a name. */
  space?: string;
}>;

/**
 * Delete a project by its ID or name.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param project - The project ID or name.
 * @param space - The space ID or name. Required when `project` is a name.
 * @returns void.
 * @throws Error if the project cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteProject } from "@arizeai/ax-client"
 *
 * await deleteProject({
 *   project: "my-project",
 *   space: "my-space",
 * });
 * ```
 */
export async function deleteProject({
  client: clientInstance,
  project,
  space,
}: DeleteProjectParams): Promise<void> {
  warnPreRelease({ functionName: "deleteProject", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const projectId = await findProjectId(client, project, spaceRef);
  const response = await client.DELETE("/v2/projects/{project_id}", {
    params: {
      path: {
        project_id: projectId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
