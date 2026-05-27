import { createClient } from "../client";
import { WithClient } from "../types";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";

export type DeletePromptVersionLabelParams = WithClient<{
  versionId: string;
  labelName: string;
}>;

/**
 * Remove a specific label from a prompt version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param versionId - The ID of the prompt version.
 * @param labelName - The label name to remove (e.g., "production").
 * @returns void.
 * @throws Error if the label cannot be removed or the response is invalid.
 * @example
 * ```typescript
 * import { deletePromptVersionLabel } from "@arizeai/ax-client"
 *
 * await deletePromptVersionLabel({
 *   versionId: "UHJvbXB0VmVyc2lvbjoxMjM0NQ==",
 *   labelName: "staging",
 * });
 * ```
 */
export async function deletePromptVersionLabel({
  client: clientInstance,
  versionId,
  labelName,
}: DeletePromptVersionLabelParams): Promise<void> {
  warnPreRelease({ functionName: "deletePromptVersionLabel" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE(
    "/v2/prompt-versions/{version_id}/labels/{label_name}",
    {
      params: { path: { version_id: versionId, label_name: labelName } },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
}
