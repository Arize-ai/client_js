import { RawPrompt } from "../../types/internal";
import { RawGraphQLPrompt } from "../../types/internal";

const mockDateString = "2024-01-01T12:00:00.000Z";
const mockPromptId = "test-prompt-id";
const mockPromptMinimalId = "test-prompt-minimal-id";
const mockPromptName = "test-prompt";
const mockPromptMinimalName = "test-prompt-minimal";
const mockSpaceId = "test-space-id";
const mockUserId = "test-user-id";

export const mockPrompt: RawPrompt = {
  id: mockPromptId,
  name: mockPromptName,
  description: "A test prompt",
  space_id: mockSpaceId,
  created_at: mockDateString,
  updated_at: mockDateString,
  created_by_user_id: mockUserId,
  tags: ["test", "evaluation"],
};

export const mockPromptMinimal: RawPrompt = {
  id: mockPromptMinimalId,
  name: mockPromptMinimalName,
  space_id: mockSpaceId,
  created_at: mockDateString,
  updated_at: mockDateString,
  created_by_user_id: mockUserId,
};

export const mockGraphQLPrompt: RawGraphQLPrompt = {
  id: "UHJvbXB0OjMwNDQ2Olg1eVk=",
  name: "test-prompt",
  description: "A test prompt",
  messages: [{ role: "system", content: "You are helpful" }],
  inputVariableFormat: "MUSTACHE",
  provider: "openAI",
  modelName: "gpt-4",
  commitHash: "abc123",
  commitMessage: "Initial",
  llmParameters: { temperature: 0.7 },
  toolCalls: null,
  tags: ["test"],
  createdAt: "2024-01-01T12:00:00.000Z",
  updatedAt: "2024-01-15T12:00:00.000Z",
};
