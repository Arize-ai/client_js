import { createClient } from "../client";
import { WithClient } from "../types";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { findPromptId, toSpaceRef } from "../utils/resolve";

export type DeletePromptParams = WithClient<{
  prompt: string;
  space?: string;
}>;

/**
 * Delete a prompt by its name or ID. This operation is irreversible.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param prompt - The name or ID of the prompt to delete.
 * @param space - An optional space name or ID (required when resolving a prompt by name).
 * @returns void.
 * @throws Error if the prompt cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deletePrompt } from "@arizeai/ax-client"
 *
 * await deletePrompt({ prompt: "customer-support", space: "my-space" });
 * ```
 */
export async function deletePrompt({
  client: clientInstance,
  prompt,
  space,
}: DeletePromptParams): Promise<void> {
  warnPreRelease({ functionName: "deletePrompt" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const promptId = await findPromptId(client, prompt, spaceRef);
  const response = await client.DELETE("/v2/prompts/{prompt_id}", {
    params: { path: { prompt_id: promptId } },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
