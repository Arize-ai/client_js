import { createClient } from "../client";
import { Prompt, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformPrompt } from "./utils";

export type UpdatePromptParams = WithClient<{
  promptId: string;
  description?: string | null;
  tags?: string[];
}>;

/**
 * Update a prompt's metadata by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param promptId - The ID of the prompt to update.
 * @param description - Updated description (pass null to clear).
 * @param tags - Updated tags array.
 * @returns The updated {@link Prompt} metadata.
 * @throws Error if the prompt cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updatePrompt } from "@arizeai/ax-client"
 *
 * const prompt = await updatePrompt({
 *   promptId: "your_prompt_id",
 *   description: "Updated description",
 *   tags: ["updated-tag"],
 * });
 * console.log(prompt);
 * ```
 *
 * @remarks Currently only supports updating description and tags.
 * At least one field must be provided or the API will return a 400 error.
 */
export async function updatePrompt({
  client: clientInstance,
  promptId,
  description,
  tags,
}: UpdatePromptParams): Promise<Prompt> {
  warnPreRelease({ functionName: "updatePrompt" });
  const client = clientInstance ?? createClient();
  const response = await client.PATCH("/v2/prompts/{prompt_id}", {
    params: {
      path: { prompt_id: promptId },
    },
    body: {
      description,
      tags,
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformPrompt(response.data);
}
