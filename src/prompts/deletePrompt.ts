import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";

export type DeletePromptParams = WithClient<{
  promptId: string;
}>;

/**
 * Delete a prompt by its ID. This operation is irreversible.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param promptId - The ID of the prompt to delete.
 * @returns void.
 * @throws Error if the prompt cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deletePrompt } from "@arizeai/ax-client"
 *
 * await deletePrompt({
 *   promptId: "your_prompt_id",
 * });
 * ```
 */
export async function deletePrompt({
  client: clientInstance,
  promptId,
}: DeletePromptParams): Promise<void> {
  warnPreRelease({ functionName: "deletePrompt" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE("/v2/prompts/{prompt_id}", {
    params: {
      path: { prompt_id: promptId },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
}
