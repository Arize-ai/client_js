import { describe, expect, it } from "vitest";
import {
  transformPrompt,
  transformGraphQLPrompt,
  transformGraphQLPromptVersion,
  transformMessageToGraphQL,
} from "../utils";
import {
  mockPrompt,
  mockPromptMinimal,
  mockGraphQLPrompt as mockRawPrompt,
  mockGraphQLPromptVersion as mockRawVersion,
} from "./fixtures";
import {
  RawGraphQLPrompt,
  RawGraphQLPromptVersion,
} from "../../types/internal";

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

describe("transformGraphQLPromptVersion", () => {
  it("should transform raw version with date conversion", () => {
    const result = transformGraphQLPromptVersion(mockRawVersion);
    expect(result).toEqual({
      id: mockRawVersion.id,
      commitHash: mockRawVersion.commitHash,
      commitMessage: mockRawVersion.commitMessage,
      messages: mockRawVersion.messages,
      inputVariableFormat: mockRawVersion.inputVariableFormat,
      provider: mockRawVersion.provider,
      modelName: mockRawVersion.modelName,
      llmParameters: mockRawVersion.llmParameters,
      labels: mockRawVersion.labels,
      providerParameters: mockRawVersion.providerParameters,
      createdAt: new Date(mockRawVersion.createdAt),
    });
  });

  it("should handle versions without optional fields", () => {
    const minimal: RawGraphQLPromptVersion = {
      id: "ver_001",
      commitHash: "abc",
      commitMessage: "init",
      messages: [],
      inputVariableFormat: "NONE",
      provider: "openAI",
      llmParameters: {},
      createdAt: "2024-01-01T00:00:00.000Z",
    };
    const result = transformGraphQLPromptVersion(minimal);
    expect(result.modelName).toBeUndefined();
    expect(result.labels).toBeUndefined();
    expect(result.providerParameters).toBeUndefined();
    expect(result.createdAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
  });
});

describe("transformGraphQLPrompt", () => {
  it("should transform raw prompt with date conversion", () => {
    const result = transformGraphQLPrompt(mockRawPrompt);
    expect(result).toEqual({
      id: mockRawPrompt.id,
      name: mockRawPrompt.name,
      description: mockRawPrompt.description,
      messages: mockRawPrompt.messages,
      inputVariableFormat: mockRawPrompt.inputVariableFormat,
      provider: mockRawPrompt.provider,
      modelName: mockRawPrompt.modelName,
      commitHash: mockRawPrompt.commitHash,
      commitMessage: mockRawPrompt.commitMessage,
      llmParameters: mockRawPrompt.llmParameters,
      toolCalls: mockRawPrompt.toolCalls,
      tags: mockRawPrompt.tags,
      createdAt: new Date(mockRawPrompt.createdAt),
      updatedAt: new Date(mockRawPrompt.updatedAt),
    });
  });

  it("should include transformed versions when versionHistory is present", () => {
    const withVersions: RawGraphQLPrompt = {
      ...mockRawPrompt,
      versionHistory: {
        edges: [{ node: mockRawVersion }],
      },
    };
    const result = transformGraphQLPrompt(withVersions);
    expect(result.versions).toHaveLength(1);
    expect(result.versions![0]!.createdAt).toBeInstanceOf(Date);
    expect(result.versions![0]!.commitHash).toBe(mockRawVersion.commitHash);
  });

  it("should not include versions when versionHistory is absent", () => {
    const result = transformGraphQLPrompt(mockRawPrompt);
    expect(result.versions).toBeUndefined();
  });

  it("should handle prompts without optional fields", () => {
    const minimal: RawGraphQLPrompt = {
      id: "id_001",
      name: "minimal",
      messages: [],
      inputVariableFormat: "NONE",
      provider: "openAI",
      commitHash: "abc",
      commitMessage: "init",
      llmParameters: {},
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };
    const result = transformGraphQLPrompt(minimal);
    expect(result.description).toBeUndefined();
    expect(result.toolCalls).toBeUndefined();
    expect(result.tags).toBeUndefined();
    expect(result.versions).toBeUndefined();
  });
});

describe("transformMessageToGraphQL", () => {
  it("should pass through role and content", () => {
    const result = transformMessageToGraphQL({
      role: "system",
      content: "Hello",
    });
    expect(result).toEqual({ role: "system", content: "Hello" });
  });

  it("should rename tool_call_id to toolCallId", () => {
    const result = transformMessageToGraphQL({
      role: "assistant",
      content: "Hi",
      tool_call_id: "tc_1",
    });
    expect(result).toEqual({
      role: "assistant",
      content: "Hi",
      toolCallId: "tc_1",
    });
  });

  it("should rename tool_calls to toolCalls", () => {
    const calls = [{ id: "tc_1", type: "function" as const, function: { name: "test", arguments: "{}" } }];
    const result = transformMessageToGraphQL({
      role: "assistant",
      content: "Hi",
      tool_calls: calls,
    });
    expect(result).toEqual({
      role: "assistant",
      content: "Hi",
      toolCalls: calls,
    });
  });

  it("should not include toolCallId or toolCalls when not present", () => {
    const result = transformMessageToGraphQL({
      role: "user",
      content: "Just text",
    });
    expect(result).not.toHaveProperty("toolCallId");
    expect(result).not.toHaveProperty("toolCalls");
  });
});
