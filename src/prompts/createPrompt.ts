import { components } from "../__generated__/api/v2";
import { createClient } from "../client";
import { Prompt, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformPrompt } from "./utils";

export type CreatePromptParams = WithClient<{
  spaceId: string;
  name: string;
  messages: components["schemas"]["LLMMessage"][];
  commitMessage: string;
  inputVariableFormat: components["schemas"]["InputVariableFormat"];
  provider: components["schemas"]["LlmProvider"];
  description?: string;
  tags?: string[];
  model?: string;
  invocationParams?: components["schemas"]["InvocationParams"];
  providerParams?: components["schemas"]["ProviderParams"];
}>;

/**
 * Create a new prompt with an initial version.
 *
 * @param client - An optional ArizeClient instance.
 * @param spaceId - The space to create the prompt in.
 * @param name - Unique prompt name within the space.
 * @param messages - At least one LLM message (system, user, assistant, tool).
 * @param commitMessage - Version description.
 * @param inputVariableFormat - Variable syntax: "f_string", "mustache", or "none".
 * @param provider - LLM provider: "openAI", "azureOpenAI", "awsBedrock", "vertexAI", "custom".
 * @returns The created {@link Prompt} metadata.
 *
 * @remarks Returns metadata only. The v2 API does not return the created
 * messages or template content in the response.
 */
export async function createPrompt({
  client: clientInstance,
  spaceId,
  name,
  messages,
  commitMessage,
  inputVariableFormat,
  provider,
  description,
  tags,
  model,
  invocationParams,
  providerParams,
}: CreatePromptParams): Promise<Prompt> {
  warnPreRelease({ functionName: "createPrompt" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/prompts", {
    body: {
      space_id: spaceId,
      name,
      messages,
      commit_message: commitMessage,
      input_variable_format: inputVariableFormat,
      provider,
      description,
      tags,
      model,
      invocation_params: invocationParams,
      provider_params: providerParams,
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformPrompt(response.data);
}
