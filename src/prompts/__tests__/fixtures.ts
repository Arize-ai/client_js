import { RawPrompt } from "../../types/internal";

export const mockPrompt: RawPrompt = {
  id: "prompt_001",
  name: "test-prompt",
  description: "A test prompt",
  space_id: "space_12345",
  created_at: "2024-01-01T12:00:00.000Z",
  updated_at: "2024-01-01T12:00:00.000Z",
  created_by_user_id: "user_12345",
  tags: ["test", "evaluation"],
};

export const mockPromptMinimal: RawPrompt = {
  id: "prompt_002",
  name: "minimal-prompt",
  space_id: "space_12345",
  created_at: "2024-01-01T12:00:00.000Z",
  updated_at: "2024-01-01T12:00:00.000Z",
  created_by_user_id: "user_12345",
};
