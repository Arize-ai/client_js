import { createClient } from "../client";
import { WithClient } from "../types/client";
import { warnPreRelease } from "../utils/warning";

export type DeletePromptParams = WithClient<{
  promptId: string;
}>;

/**
 * Delete a prompt by its ID. This operation is irreversible.
 *
 * @param client - An optional ArizeClient instance.
 * @param promptId - The unique identifier of the prompt to delete.
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
