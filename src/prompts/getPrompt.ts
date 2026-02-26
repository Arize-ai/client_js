import { createClient } from "../client";
import { Prompt, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformPrompt } from "./utils";

export type GetPromptParams = WithClient<{
  promptId: string;
}>;

/**
 * Get a specific prompt by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param promptId - The ID of the prompt to get.
 * @returns A {@link Prompt} metadata object.
 * @throws Error if the prompt cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getPrompt } from "@arizeai/ax-client"
 *
 * const prompt = await getPrompt({ promptId: "your_prompt_id" });
 * console.log(prompt);
 * ```
 *
 * @remarks Returns metadata only (id, name, description, tags, timestamps).
 * The v2 API does not include messages, model config, or invocation parameters
 * in the GET response.
 */
export async function getPrompt({
  client: clientInstance,
  promptId,
}: GetPromptParams): Promise<Prompt> {
  warnPreRelease({ functionName: "getPrompt" });
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/prompts/{prompt_id}", {
    params: {
      path: { prompt_id: promptId },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformPrompt(response.data);
}
