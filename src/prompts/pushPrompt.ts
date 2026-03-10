import { isDeepStrictEqual } from "node:util";
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
  PromptWithContent,
  ProviderParams,
  PushPromptResult,
} from "../types";
import { warnPreRelease } from "../utils/warning";
import { getPromptContent } from "./getPromptContent";
import { transformMessageToGraphQL } from "./utils";

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

function isVersionUnchanged(
  existing: PromptWithContent,
  graphqlMessages: Record<string, unknown>[],
  graphqlFormat: string,
  model: string | undefined,
  provider: string,
  invocationParams: Record<string, unknown>,
): boolean {
  if (!isDeepStrictEqual(existing.messages, graphqlMessages)) return false;
  if (existing.inputVariableFormat !== graphqlFormat) return false;
  if ((existing.modelName ?? null) !== (model ?? null)) return false;
  if (existing.provider !== provider) return false;
  if (!isDeepStrictEqual(existing.llmParameters, invocationParams))
    return false;
  return true;
}

/**
 * Push a prompt via the GraphQL API. Creates a new prompt if one with the
 * given name does not exist, or creates a new version if it does.
 *
 * @param params.spaceNodeId - GraphQL node ID of the space.
 * @param params.name - Prompt name (unique within the space).
 * @param params.messages - At least one LLM message.
 * @param params.commitMessage - Version description.
 * @param params.inputVariableFormat - Variable syntax: "f_string", "mustache", or "none".
 * @param params.provider - LLM provider.
 * @param params.description - Optional prompt description (used on create only).
 * @param params.tags - Optional tags (used on create only).
 * @param params.model - Optional model identifier.
 * @param params.invocationParams - Optional invocation parameters.
 * @param params.providerParams - Optional provider-specific parameters.
 * @param params.apiKey - Override API key.
 * @param params.baseUrl - Override GraphQL base URL.
 * @returns A {@link PushPromptResult} indicating the action taken.
 */
export async function pushPrompt(
  params: PushPromptParams,
): Promise<PushPromptResult> {
  warnPreRelease({ functionName: "pushPrompt" });

  const clientOptions: GraphQLClientOptions = {
    apiKey: params.apiKey,
    baseUrl: params.baseUrl,
  };

  const graphqlMessages = params.messages.map(transformMessageToGraphQL);
  const graphqlFormat = params.inputVariableFormat.toUpperCase();
  const invocationParams = params.invocationParams ?? {};
  const providerParams = params.providerParams ?? {};

  try {
    const existing = await getPromptContent({
      promptName: params.name,
      spaceNodeId: params.spaceNodeId,
      apiKey: params.apiKey,
      baseUrl: params.baseUrl,
    });

    if (
      isVersionUnchanged(
        existing,
        graphqlMessages,
        graphqlFormat,
        params.model,
        params.provider,
        invocationParams,
      )
    ) {
      return {
        action: "unchanged",
        promptId: existing.id,
        name: existing.name,
      };
    }

    // Prompt exists — create a new version
    const data = await graphqlFetch<{
      createPromptVersion: { promptVersion: { id: string } };
    }>(clientOptions, CREATE_PROMPT_VERSION_MUTATION, {
      spaceId: params.spaceNodeId,
      promptId: existing.id,
      commitMessage: params.commitMessage,
      inputVariableFormat: graphqlFormat,
      provider: params.provider,
      model: params.model,
      messages: graphqlMessages,
      invocationParams,
      providerParams,
    });

    return {
      action: "updated",
      promptId: existing.id,
      name: existing.name,
      versionId: data.createPromptVersion.promptVersion.id,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);

    if (message.includes("not found")) {
      // Prompt does not exist — create it
      const data = await graphqlFetch<{
        createPrompt: {
          prompt: { id: string; name: string };
          promptVersion?: { id: string };
        };
      }>(clientOptions, CREATE_PROMPT_MUTATION, {
        spaceId: params.spaceNodeId,
        name: params.name,
        description: params.description,
        tags: params.tags,
        commitMessage: params.commitMessage,
        inputVariableFormat: graphqlFormat,
        provider: params.provider,
        model: params.model,
        messages: graphqlMessages,
        invocationParams,
        providerParams,
      });

      return {
        action: "created",
        promptId: data.createPrompt.prompt.id,
        name: data.createPrompt.prompt.name,
        versionId: data.createPrompt.promptVersion?.id,
      };
    }

    throw error;
  }
}
