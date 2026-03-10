export type PromptVersion = {
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
  createdAt: Date;
};

export type PromptWithContent = {
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
  labels?: string[];
  providerParameters?: Record<string, unknown>;
  createdAt: Date;
  versionId?: string;
  updatedAt: Date;
  versions?: PromptVersion[];
};
