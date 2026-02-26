import { RawPrompt } from "../../types/internal";

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
