import {
  RawPrompt,
  RawPromptVersion,
  RawPromptWithVersion,
} from "../../types/internal";

const mockDateString = "2024-01-01T12:00:00.000Z";
const mockUpdatedDateString = "2024-01-02T12:00:00.000Z";

export const mockPromptId = "prompt_001";
export const mockVersionId = "pv_001";
export const mockSpaceId = "space_12345";
export const mockUserId = "user_12345";

export const mockPromptVersion: RawPromptVersion = {
  id: mockVersionId,
  prompt_id: mockPromptId,
  commit_hash: "abc123def456",
  commit_message: "Initial version",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello, {name}!" },
  ],
  input_variable_format: "f_string",
  provider: "openAI",
  model: "gpt-4",
  invocation_params: { temperature: 0.7, max_tokens: 1000 },
  created_at: mockDateString,
  created_by_user_id: mockUserId,
  labels: ["production"],
};

export const mockPrompt: RawPrompt = {
  id: mockPromptId,
  name: "My Prompt",
  description: "A prompt for customer support",
  space_id: mockSpaceId,
  created_at: mockDateString,
  updated_at: mockUpdatedDateString,
  created_by_user_id: mockUserId,
};

export const mockPromptWithVersion: RawPromptWithVersion = {
  ...mockPrompt,
  version: mockPromptVersion,
};
