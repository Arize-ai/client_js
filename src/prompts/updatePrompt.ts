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
 * @param client - An optional ArizeClient instance.
 * @param promptId - The unique identifier of the prompt.
 * @param description - Updated description (pass null to clear).
 * @param tags - Updated tags array.
 * @returns The updated {@link Prompt} metadata.
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
