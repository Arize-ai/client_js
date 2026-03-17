import { createClient } from "../client";
import { WithClient } from "../types";
import { handleApiError } from "../errors";
import { Prompt } from "../types/prompts";
import { warnPreRelease } from "../utils/warning";
import { transformPrompt } from "./utils";

export type UpdatePromptParams = WithClient<{
  promptId: string;
  /** Updated description for the prompt. Pass null to clear it. */
  description?: string | null;
}>;

/**
 * Update a prompt's metadata by its ID.
 *
 * Currently supports updating the description.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param promptId - The ID of the prompt to update.
 * @param description - An updated description for the prompt. Pass null to clear it.
 * @returns The updated {@link Prompt}.
 * @throws Error if the prompt cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updatePrompt } from "@arizeai/ax-client"
 *
 * const updated = await updatePrompt({
 *   promptId: "prompt_12345",
 *   description: "Updated description for the prompt",
 * });
 * console.log(updated);
 * ```
 */
export async function updatePrompt({
  client: clientInstance,
  promptId,
  description,
}: UpdatePromptParams): Promise<Prompt> {
  warnPreRelease({ functionName: "updatePrompt" });
  const client = clientInstance ?? createClient();
  const response = await client.PATCH("/v2/prompts/{prompt_id}", {
    params: { path: { prompt_id: promptId } },
    body: { description },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformPrompt(response.data);
}
