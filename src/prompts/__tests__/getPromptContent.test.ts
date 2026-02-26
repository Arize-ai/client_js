import { afterEach, describe, expect, it } from "vitest";
import nock from "nock";
import { getPromptContent } from "../getPromptContent";

const BASE_URL = "https://app.arize.com";
const API_KEY = "test-api-key";

const mockRawPrompt = {
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

afterEach(() => {
  nock.cleanAll();
});

describe("getPromptContent", () => {
  it("should fetch prompt by node ID", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, { data: { node: mockRawPrompt } });

    const result = await getPromptContent({
      promptNodeId: "UHJvbXB0OjMwNDQ2Olg1eVk=",
      apiKey: API_KEY,
      baseUrl: BASE_URL,
    });

    expect(result.id).toBe(mockRawPrompt.id);
    expect(result.name).toBe(mockRawPrompt.name);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("should fetch prompt by name and space ID", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              edges: [{ node: mockRawPrompt }],
            },
          },
        },
      });

    const result = await getPromptContent({
      promptName: "test-prompt",
      spaceNodeId: "U3BhY2U6MTIz",
      apiKey: API_KEY,
      baseUrl: BASE_URL,
    });

    expect(result.name).toBe("test-prompt");
  });

  it("should throw when prompt not found by node ID", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, { data: { node: null } });

    await expect(
      getPromptContent({
        promptNodeId: "invalid",
        apiKey: API_KEY,
        baseUrl: BASE_URL,
      }),
    ).rejects.toThrow("Prompt not found");
  });

  it("should throw when prompt not found by name", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: { node: { prompts: { edges: [] } } },
      });

    await expect(
      getPromptContent({
        promptName: "nonexistent",
        spaceNodeId: "U3BhY2U6MTIz",
        apiKey: API_KEY,
        baseUrl: BASE_URL,
      }),
    ).rejects.toThrow('Prompt "nonexistent" not found');
  });

  it("should throw when neither promptNodeId nor promptName is provided", async () => {
    await expect(
      getPromptContent({
        apiKey: API_KEY,
        baseUrl: BASE_URL,
      }),
    ).rejects.toThrow("Either promptNodeId or both promptName and spaceNodeId");
  });

  it("should throw when promptName is provided without spaceNodeId", async () => {
    await expect(
      getPromptContent({
        promptName: "test",
        apiKey: API_KEY,
        baseUrl: BASE_URL,
      }),
    ).rejects.toThrow("Either promptNodeId or both promptName and spaceNodeId");
  });
});
