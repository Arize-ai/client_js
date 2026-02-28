import { PromptVersion, PromptWithContent, LLMMessage } from "../types";

export type RawGraphQLPromptVersion = {
  id: string;
  commitHash: string;
  commitMessage: string;
  messages: Record<string, unknown>[];
  inputVariableFormat: "F_STRING" | "MUSTACHE" | "NONE";
  provider: string;
  modelName?: string | null;
  llmParameters: Record<string, unknown>;
  labels?: string[];
  providerParameters?: Record<string, unknown>;
  createdAt: string;
};

export type RawGraphQLPrompt = {
  id: string;
  name: string;
  description?: string | null;
  messages: Record<string, unknown>[];
  inputVariableFormat: "F_STRING" | "MUSTACHE" | "NONE";
  provider: string;
  modelName?: string | null;
  commitHash: string;
  commitMessage: string;
  llmParameters: Record<string, unknown>;
  toolCalls?: Record<string, unknown>[] | null;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  versionHistory?: {
    edges: Array<{ node: RawGraphQLPromptVersion }>;
  };
};

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
