import { components } from "../__generated__/api/v2";

export type Prompt = {
  id: string;
  name: string;
  description?: string | null;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string;
  tags?: string[];
};

// Re-export schema types that users need when calling createPrompt()
export type InputVariableFormat = components["schemas"]["InputVariableFormat"];
export type LlmProvider = components["schemas"]["LlmProvider"];
export type MessageRole = components["schemas"]["MessageRole"];
export type LLMMessage = components["schemas"]["LLMMessage"];
export type InvocationParams = components["schemas"]["InvocationParams"];
export type ProviderParams = components["schemas"]["ProviderParams"];

export type PushPromptResult = {
  /** Whether the prompt was newly created or an existing prompt was updated with a new version */
  action: "created" | "updated" | "unchanged";
  /** The prompt's GraphQL node ID */
  promptId: string;
  /** The prompt name */
  name: string;
};
