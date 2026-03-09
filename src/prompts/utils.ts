import { Prompt, PromptVersion, PromptWithContent, LLMMessage } from "../types";
import {
  RawPrompt,
  RawGraphQLPrompt,
  RawGraphQLPromptVersion,
} from "../types/internal";

export function transformPrompt(prompt: RawPrompt): Prompt {
  return {
    id: prompt.id,
    name: prompt.name,
    description: prompt.description,
    spaceId: prompt.space_id,
    createdAt: new Date(prompt.created_at),
    updatedAt: new Date(prompt.updated_at),
    createdByUserId: prompt.created_by_user_id,
    tags: prompt.tags,
  };
}

export function transformGraphQLPromptVersion(
  raw: RawGraphQLPromptVersion,
): PromptVersion {
  return {
    id: raw.id,
    commitHash: raw.commitHash,
    commitMessage: raw.commitMessage,
    messages: raw.messages,
    inputVariableFormat: raw.inputVariableFormat,
    provider: raw.provider,
    modelName: raw.modelName,
    llmParameters: raw.llmParameters,
    labels: raw.labels,
    providerParameters: raw.providerParameters,
    createdAt: new Date(raw.createdAt),
  };
}

export function transformGraphQLPrompt(
  raw: RawGraphQLPrompt,
): PromptWithContent {
  const result: PromptWithContent = {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    messages: raw.messages,
    inputVariableFormat: raw.inputVariableFormat,
    provider: raw.provider,
    modelName: raw.modelName,
    commitHash: raw.commitHash,
    commitMessage: raw.commitMessage,
    llmParameters: raw.llmParameters,
    toolCalls: raw.toolCalls,
    tags: raw.tags,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };

  if (raw.versionHistory) {
    result.versions = raw.versionHistory.edges.map((edge) =>
      transformGraphQLPromptVersion(edge.node),
    );
  }

  return result;
}

export function transformMessageToGraphQL(msg: LLMMessage) {
  return {
    role: msg.role,
    content: msg.content,
    ...(msg.tool_call_id != null && { toolCallId: msg.tool_call_id }),
    ...(msg.tool_calls != null && { toolCalls: msg.tool_calls }),
  };
}
