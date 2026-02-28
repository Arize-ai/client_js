import { graphqlFetch, GraphQLClientOptions } from "../graphql";
import {
  CREATE_PROMPT_MUTATION,
  CREATE_PROMPT_VERSION_MUTATION,
} from "../graphql/queries/prompts";
import {
  InvocationParams,
  InputVariableFormat,
  LLMMessage,
  LlmProvider,
  ProviderParams,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { findPromptByName } from "./getPromptContent";
import { transformMessageToGraphQL } from "./transformGraphQL";

export type PushPromptParams = {
  /** GraphQL node ID of the space (base64-encoded Relay Global ID) */
  spaceNodeId: string;
  /** Prompt name (unique within the space) */
  name: string;
  /** At least one LLM message */
  messages: LLMMessage[];
  /** Version description */
  commitMessage: string;
  /** Variable syntax: "f_string", "mustache", or "none" */
  inputVariableFormat: InputVariableFormat;
  /** LLM provider */
  provider: LlmProvider;
  /** Optional prompt description (only used when creating a new prompt) */
  description?: string;
  /** Optional tags (only used when creating a new prompt) */
  tags?: string[];
  /** Optional model identifier */
  model?: string;
  /** Optional invocation parameters (defaults to {} for GraphQL) */
  invocationParams?: InvocationParams;
  /** Optional provider-specific parameters (defaults to {} for GraphQL) */
  providerParams?: ProviderParams;
  /** Override API key */
  apiKey?: string;
  /** Override GraphQL base URL (default: https://app.arize.com) */
  baseUrl?: string;
};

export type PushPromptResult = {
  /** Whether the prompt was newly created or an existing prompt was updated with a new version */
  action: "created" | "updated";
  /** The prompt's GraphQL node ID */
  promptId: string;
  /** The prompt name */
  name: string;
};

/**
 * Push a prompt via the GraphQL API. Creates a new prompt if one with the
 * given name does not exist, or creates a new version if it does.
 *
 * @param spaceNodeId - GraphQL node ID of the space.
 * @param name - Prompt name (unique within the space).
 * @param messages - At least one LLM message.
 * @param commitMessage - Version description.
 * @param inputVariableFormat - Variable syntax: "f_string", "mustache", or "none".
 * @param provider - LLM provider.
 * @param description - Optional prompt description (used on create only).
 * @param tags - Optional tags (used on create only).
 * @param model - Optional model identifier.
 * @param invocationParams - Optional invocation parameters.
 * @param providerParams - Optional provider-specific parameters.
 * @param apiKey - Override API key.
 * @param baseUrl - Override GraphQL base URL.
 * @returns A {@link PushPromptResult} indicating the action taken.
 * @throws Error if the GraphQL request fails (auth, network, mutation error).
 * @example
 * ```typescript
 * import { pushPrompt } from "@arizeai/ax-client"
 *
 * const result = await pushPrompt({
 *   spaceNodeId: "your_space_relay_node_id",
 *   name: "my-prompt",
 *   messages: [{ role: "system", content: "You are helpful" }],
 *   commitMessage: "Initial version",
 *   inputVariableFormat: "mustache",
 *   provider: "openAI",
 * });
 * console.log(result); // { action: "created", promptId: "...", name: "my-prompt" }
 * ```
 */
export async function pushPrompt({
  spaceNodeId,
  name,
  messages,
  commitMessage,
  inputVariableFormat,
  provider,
  description,
  tags,
  model,
  invocationParams: invocationParamsInput,
  providerParams: providerParamsInput,
  apiKey,
  baseUrl,
}: PushPromptParams): Promise<PushPromptResult> {
  warnPreRelease({ functionName: "pushPrompt" });

  const clientOptions: GraphQLClientOptions = { apiKey, baseUrl };
  const graphqlMessages = messages.map(transformMessageToGraphQL);
  const graphqlFormat = inputVariableFormat.toUpperCase();
  const invocationParams = invocationParamsInput ?? {};
  const providerParams = providerParamsInput ?? {};

  const existing = await findPromptByName({
    promptName: name,
    spaceNodeId,
    apiKey,
    baseUrl,
  });

  if (existing) {
    await graphqlFetch(clientOptions, CREATE_PROMPT_VERSION_MUTATION, {
      spaceId: spaceNodeId,
      promptId: existing.id,
      commitMessage,
      inputVariableFormat: graphqlFormat,
      provider,
      model,
      messages: graphqlMessages,
      invocationParams,
      providerParams,
    });

    return {
      action: "updated",
      promptId: existing.id,
      name: existing.name,
    };
  }

  const data = await graphqlFetch<{
    createPrompt: { prompt: { id: string; name: string } };
  }>(clientOptions, CREATE_PROMPT_MUTATION, {
    spaceId: spaceNodeId,
    name,
    description,
    tags,
    commitMessage,
    inputVariableFormat: graphqlFormat,
    provider,
    model,
    messages: graphqlMessages,
    invocationParams,
    providerParams,
  });

  return {
    action: "created",
    promptId: data.createPrompt.prompt.id,
    name: data.createPrompt.prompt.name,
  };
}
