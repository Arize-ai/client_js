import { describe, expect, it } from "vitest";
import {
  transformPrompt,
  transformPromptVersion,
  transformPromptWithVersion,
} from "../utils";
import {
  mockPrompt,
  mockPromptId,
  mockPromptVersion,
  mockPromptWithVersion,
  mockSpaceId,
  mockUserId,
  mockVersionId,
} from "./fixtures";

describe("transformPrompt", () => {
  it("should convert snake_case fields to camelCase and parse dates", () => {
    const result = transformPrompt(mockPrompt);
    expect(result).toEqual({
      id: mockPromptId,
      name: "My Prompt",
      description: "A prompt for customer support",
      spaceId: mockSpaceId,
      createdAt: new Date(mockPrompt.created_at),
      updatedAt: new Date(mockPrompt.updated_at),
      createdByUserId: mockUserId,
    });
  });
});

describe("transformPromptVersion", () => {
  it("should convert snake_case fields to camelCase and parse dates", () => {
    const result = transformPromptVersion(mockPromptVersion);
    expect(result).toEqual({
      id: mockVersionId,
      promptId: mockPromptId,
      commitHash: "abc123def456",
      commitMessage: "Initial version",
      messages: mockPromptVersion.messages,
      inputVariableFormat: "F_STRING",
      provider: "OPEN_AI",
      model: "gpt-4",
      invocationParams: { temperature: 0.7, max_tokens: 1000 },
      providerParams: undefined,
      toolConfig: undefined,
      createdAt: new Date(mockPromptVersion.created_at),
      createdByUserId: mockUserId,
      labels: ["production"],
    });
  });
});

describe("transformPromptWithVersion", () => {
  it("should transform both prompt and nested version fields", () => {
    const result = transformPromptWithVersion(mockPromptWithVersion);
    expect(result).toEqual({
      id: mockPromptId,
      name: "My Prompt",
      description: "A prompt for customer support",
      spaceId: mockSpaceId,
      createdAt: new Date(mockPrompt.created_at),
      updatedAt: new Date(mockPrompt.updated_at),
      createdByUserId: mockUserId,
      version: {
        id: mockVersionId,
        promptId: mockPromptId,
        commitHash: "abc123def456",
        commitMessage: "Initial version",
        messages: mockPromptVersion.messages,
        inputVariableFormat: "F_STRING",
        provider: "OPEN_AI",
        model: "gpt-4",
        // invocation_params fields (e.g., max_tokens) retain snake_case — nested objects
        // are passed through without further transformation.
        invocationParams: { temperature: 0.7, max_tokens: 1000 },
        providerParams: undefined,
        toolConfig: undefined,
        createdAt: new Date(mockPromptVersion.created_at),
        createdByUserId: mockUserId,
        labels: ["production"],
      },
    });
  });
});
