import { describe, expect, it } from "vitest";
import {
  transformGraphQLPrompt,
  transformGraphQLPromptVersion,
  transformMessageToGraphQL,
  RawGraphQLPrompt,
  RawGraphQLPromptVersion,
} from "../transformGraphQL";

const mockRawVersion: RawGraphQLPromptVersion = {
  id: "UHJvbXB0VmVyc2lvbjoxMjM=",
  commitHash: "abc123",
  commitMessage: "Initial version",
  messages: [{ role: "system", content: "You are a helpful assistant" }],
  inputVariableFormat: "MUSTACHE",
  provider: "openAI",
  modelName: "gpt-4",
  llmParameters: { temperature: 0.7 },
  labels: ["production"],
  providerParameters: { topP: 0.9 },
  createdAt: "2024-01-01T12:00:00.000Z",
};

const mockRawPrompt: RawGraphQLPrompt = {
  id: "UHJvbXB0OjMwNDQ2Olg1eVk=",
  name: "test-prompt",
  description: "A test prompt",
  messages: [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "Hello {{name}}" },
  ],
  inputVariableFormat: "MUSTACHE",
  provider: "openAI",
  modelName: "gpt-4",
  commitHash: "def456",
  commitMessage: "Latest version",
  llmParameters: { temperature: 0.7, maxTokens: 1000 },
  toolCalls: [{ name: "search", description: "Search the web" }],
  tags: ["test", "evaluation"],
  createdAt: "2024-01-01T12:00:00.000Z",
  updatedAt: "2024-01-15T12:00:00.000Z",
};

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
