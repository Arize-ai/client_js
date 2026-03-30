import { createClient } from "../client";
import { WithClient } from "../types";
import {
  InputVariableFormat,
  InvocationParams,
  LLMMessage,
  LlmProvider,
  PromptWithVersion,
  ProviderParams,
} from "../types/prompts";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { findSpaceId } from "../utils/resolve";
import { transformPromptWithVersion } from "./utils";

export type CreatePromptVersionInput = {
  commitMessage: string;
  inputVariableFormat: InputVariableFormat;
  provider: LlmProvider;
  model?: string;
  messages: LLMMessage[];
  invocationParams?: InvocationParams;
  providerParams?: ProviderParams;
};

export type CreatePromptParams = WithClient<{
  space: string;
  name: string;
  description?: string;
  version: CreatePromptVersionInput;
}>;

/**
 * Create a new prompt with an initial version.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - The space name or ID to create the prompt in.
 * @param name - The name of the prompt (must be unique within the space).
 * @param description - An optional description for the prompt.
 * @param version - The initial version configuration.
 * @returns A {@link PromptWithVersion} containing the created prompt and its initial version.
 * @throws Error if the prompt cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createPrompt } from "@arizeai/ax-client"
 *
 * const prompt = await createPrompt({
 *   space: "my-space",
 *   name: "customer-support",
 *   description: "A prompt for customer support interactions",
 *   version: {
 *     commitMessage: "Initial version",
 *     inputVariableFormat: "f_string",
 *     provider: "openAI",
 *     model: "gpt-4",
 *     messages: [
 *       { role: "system", content: "You are a helpful assistant." },
 *       { role: "user", content: "Hello, {name}!" },
 *     ],
 *   },
 * });
 * console.log(prompt);
 * ```
 */
export async function createPrompt({
  client: clientInstance,
  space,
  name,
  description,
  version,
}: CreatePromptParams): Promise<PromptWithVersion> {
  warnPreRelease({ functionName: "createPrompt" });
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, space);
  const response = await client.POST("/v2/prompts", {
    body: {
      space_id: spaceId,
      name,
      description,
      version: {
        commit_message: version.commitMessage,
        input_variable_format: version.inputVariableFormat,
        provider: version.provider,
        model: version.model,
        messages: version.messages,
        invocation_params: version.invocationParams,
        provider_params: version.providerParams,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformPromptWithVersion(response.data);
}
