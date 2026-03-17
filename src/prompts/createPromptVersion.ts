import { createClient } from "../client";
import { WithClient } from "../types";
import { PromptVersion } from "../types/prompts";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { CreatePromptVersionInput } from "./createPrompt";
import { transformPromptVersion } from "./utils";

export type CreatePromptVersionParams = WithClient<
  CreatePromptVersionInput & { promptId: string }
>;

/**
 * Create a new version of an existing prompt.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param promptId - The ID of the prompt to create a new version for.
 * @param commitMessage - A message describing the changes in this version.
 * @param inputVariableFormat - The format for input variables in prompt messages.
 * @param provider - The LLM provider.
 * @param model - An optional model identifier.
 * @param messages - The messages that make up the prompt template.
 * @param invocationParams - Optional LLM invocation parameters.
 * @param providerParams - Optional provider-specific parameters.
 * @returns The created {@link PromptVersion}.
 * @throws Error if the version cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createPromptVersion } from "@arizeai/ax-client"
 *
 * const version = await createPromptVersion({
 *   promptId: "prompt_12345",
 *   commitMessage: "Updated system prompt for better responses",
 *   inputVariableFormat: "f_string",
 *   provider: "openAI",
 *   model: "gpt-4",
 *   messages: [
 *     { role: "system", content: "You are a helpful assistant." },
 *     { role: "user", content: "Hello, {name}!" },
 *   ],
 * });
 * console.log(version);
 * ```
 */
export async function createPromptVersion({
  client: clientInstance,
  promptId,
  commitMessage,
  inputVariableFormat,
  provider,
  model,
  messages,
  invocationParams,
  providerParams,
}: CreatePromptVersionParams): Promise<PromptVersion> {
  warnPreRelease({ functionName: "createPromptVersion" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/prompts/{prompt_id}/versions", {
    params: { path: { prompt_id: promptId } },
    body: {
      commit_message: commitMessage,
      input_variable_format: inputVariableFormat,
      provider,
      model,
      messages,
      invocation_params: invocationParams,
      provider_params: providerParams,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformPromptVersion(response.data);
}
