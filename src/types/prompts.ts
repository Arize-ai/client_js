import { components } from "../__generated__/api/v2";

export type InputVariableFormat = components["schemas"]["InputVariableFormat"];
export type LlmProvider = components["schemas"]["LlmProvider"];
export type MessageRole = components["schemas"]["MessageRole"];
export type LLMMessage = components["schemas"]["LLMMessage"];
export type InvocationParams = components["schemas"]["InvocationParams"];
export type ProviderParams = components["schemas"]["ProviderParams"];
export type ToolConfig = components["schemas"]["ToolConfig"];

export type Prompt = {
  id: string;
  name: string;
  description?: string | null;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string;
};

export type PromptVersion = {
  id: string;
  promptId: string;
  commitHash: string;
  commitMessage: string;
  messages: LLMMessage[];
  inputVariableFormat: InputVariableFormat;
  provider: LlmProvider;
  /** The model to use for the call. May be undefined if no model was set on this version. */
  model?: string;
  /**
   * Parameters for the LLM invocation. Note: nested fields (e.g., `max_tokens`) retain
   * their original snake_case names from the API and are not further transformed.
   */
  invocationParams?: InvocationParams;
  /**
   * Provider-specific parameters. Note: nested fields retain their original snake_case
   * names from the API and are not further transformed.
   */
  providerParams?: ProviderParams;
  toolConfig?: ToolConfig;
  createdAt: Date;
  createdByUserId: string;
  labels?: string[];
};

export type PromptWithVersion = Prompt & {
  version: PromptVersion;
};
