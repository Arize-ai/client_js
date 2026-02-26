import { describe, expect, it } from "vitest";
import { transformPrompt } from "../utils";
import { mockPrompt, mockPromptMinimal } from "./fixtures";

describe("transformPrompt", () => {
  it("should transform the snake_case fields of a prompt to camelCase and dates to Date objects", () => {
    const expectedResult = {
      id: mockPrompt.id,
      name: mockPrompt.name,
      description: mockPrompt.description,
      spaceId: mockPrompt.space_id,
      createdAt: new Date(mockPrompt.created_at),
      updatedAt: new Date(mockPrompt.updated_at),
      createdByUserId: mockPrompt.created_by_user_id,
      tags: mockPrompt.tags,
    };
    const result = transformPrompt(mockPrompt);
    expect(result).toEqual(expectedResult);
  });
});

describe("transformPrompt with minimal fields", () => {
  it("should handle prompts without optional fields", () => {
    const expectedResult = {
      id: mockPromptMinimal.id,
      name: mockPromptMinimal.name,
      description: mockPromptMinimal.description,
      spaceId: mockPromptMinimal.space_id,
      createdAt: new Date(mockPromptMinimal.created_at),
      updatedAt: new Date(mockPromptMinimal.updated_at),
      createdByUserId: mockPromptMinimal.created_by_user_id,
      tags: mockPromptMinimal.tags,
    };
    const result = transformPrompt(mockPromptMinimal);
    expect(result).toEqual(expectedResult);
  });
});
