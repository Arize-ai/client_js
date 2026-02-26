import { describe, expect, it } from "vitest";
import { transformPrompt } from "../utils";
import { mockRawPrompt, mockRawPromptMinimal } from "./fixtures";

describe("transformPrompt", () => {
  it("should transform snake_case fields to camelCase and dates to Date objects", () => {
    const result = transformPrompt(mockRawPrompt);
    expect(result).toEqual({
      id: "prompt_001",
      name: "test-prompt",
      description: "A test prompt",
      spaceId: "space_12345",
      createdAt: new Date("2024-01-01T12:00:00.000Z"),
      updatedAt: new Date("2024-01-01T12:00:00.000Z"),
      createdByUserId: "user_12345",
      tags: ["test", "evaluation"],
    });
  });

  it("should handle prompts without optional fields", () => {
    const result = transformPrompt(mockRawPromptMinimal);
    expect(result).toEqual({
      id: "prompt_002",
      name: "minimal-prompt",
      spaceId: "space_12345",
      createdAt: new Date("2024-01-01T12:00:00.000Z"),
      updatedAt: new Date("2024-01-01T12:00:00.000Z"),
      createdByUserId: "user_12345",
    });
  });
});
