import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";

export type DeleteProjectParams = WithClient<{
  projectId: string;
}>;

/**
 * Delete a project by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param projectId - The ID of the project to delete.
 * @returns void.
 * @throws Error if the project cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteProject } from "@arizeai/ax-client"
 *
 * await deleteProject({
 *   projectId: "your_project_id",
 * });
 * ```
 */
export async function deleteProject({
  client: clientInstance,
  projectId,
}: DeleteProjectParams): Promise<void> {
  warnPreRelease({ functionName: "deleteProject" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE("/v2/projects/{project_id}", {
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
}
