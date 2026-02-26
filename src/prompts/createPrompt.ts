import { createClient } from "../client";
import {
  InvocationParams,
  InputVariableFormat,
  LLMMessage,
  LlmProvider,
  Prompt,
  ProviderParams,
  WithClient,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformPrompt } from "./utils";

export type CreatePromptParams = WithClient<{
  spaceId: string;
  name: string;
  messages: LLMMessage[];
  commitMessage: string;
  inputVariableFormat: InputVariableFormat;
  provider: LlmProvider;
  description?: string;
  tags?: string[];
  model?: string;
  invocationParams?: InvocationParams;
  providerParams?: ProviderParams;
}>;

/**
 * Create a new prompt with an initial version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - The space to create the prompt in.
 * @param name - Unique prompt name within the space.
 * @param messages - At least one LLM message (system, user, assistant, tool).
 * @param commitMessage - Version description.
 * @param inputVariableFormat - Variable syntax: "f_string", "mustache", or "none".
 * @param provider - LLM provider: "openAI", "azureOpenAI", "awsBedrock", "vertexAI", "custom".
 * @param description - An optional description for the prompt.
 * @param tags - An optional array of tags to associate with the prompt.
 * @param model - An optional model identifier for the prompt.
 * @param invocationParams - An optional set of invocation parameters.
 * @param providerParams - An optional set of provider-specific parameters.
 * @returns The created {@link Prompt} metadata.
 * @throws Error if the prompt cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createPrompt } from "@arizeai/ax-client"
 *
 * const prompt = await createPrompt({
 *   spaceId: "your_space_id",
 *   name: "my-prompt",
 *   commitMessage: "Initial version",
 *   inputVariableFormat: "f_string",
 *   provider: "openAI",
 *   messages: [
 *     { role: "system", content: "You are a helpful assistant." },
 *     { role: "user", content: "Hello, {name}!" },
 *   ],
 * });
 * console.log(prompt);
 * ```
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
