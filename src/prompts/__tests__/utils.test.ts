import { describe, expect, it } from "vitest";
import { transformPrompt } from "../utils";
import { mockPrompt, mockPromptMinimal } from "./fixtures";

describe("transformPrompt", () => {
  it("should transform snake_case fields to camelCase and dates to Date objects", () => {
    const result = transformPrompt(mockPrompt);
    expect(result).toEqual({
      id: mockPrompt.id,
      name: mockPrompt.name,
      description: mockPrompt.description,
      spaceId: mockPrompt.space_id,
      createdAt: new Date(mockPrompt.created_at),
      updatedAt: new Date(mockPrompt.updated_at),
      createdByUserId: mockPrompt.created_by_user_id,
      tags: mockPrompt.tags,
    });
  });

  it("should handle prompts without optional fields", () => {
    const result = transformPrompt(mockPromptMinimal);
    expect(result).toEqual({
      id: mockPromptMinimal.id,
      name: mockPromptMinimal.name,
      description: mockPromptMinimal.description,
      spaceId: mockPromptMinimal.space_id,
      createdAt: new Date(mockPromptMinimal.created_at),
      updatedAt: new Date(mockPromptMinimal.updated_at),
      createdByUserId: mockPromptMinimal.created_by_user_id,
      tags: mockPromptMinimal.tags,
    });
  });
});
