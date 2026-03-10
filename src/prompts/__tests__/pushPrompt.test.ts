import { afterEach, describe, expect, it } from "vitest";
import nock from "nock";
import { pushPrompt } from "../pushPrompt";

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

const defaultParams = {
  spaceNodeId: "U3BhY2U6MTIz",
  name: "test-prompt",
  messages: [{ role: "system" as const, content: "You are helpful" }],
  commitMessage: "Test version",
  inputVariableFormat: "mustache" as const,
  provider: "openAI" as const,
  apiKey: API_KEY,
  baseUrl: BASE_URL,
};

afterEach(() => {
  nock.cleanAll();
});

describe("pushPrompt", () => {
  it("should create a new prompt when it does not exist", async () => {
    // First call: lookup returns empty edges (prompt not found)
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              edges: [],
            },
          },
        },
      });

    // Second call: createPrompt mutation succeeds
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          createPrompt: {
            prompt: {
              id: "UHJvbXB0OjEyMzQ1",
              name: "test-prompt",
            },
          },
        },
      });

    const result = await pushPrompt(defaultParams);

    expect(result).toEqual({
      action: "created",
      promptId: "UHJvbXB0OjEyMzQ1",
      name: "test-prompt",
    });
  });

  it("should create a new version when prompt already exists", async () => {
    // First call: lookup returns an existing prompt
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

    // Second call: createPromptVersion mutation succeeds
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          createPromptVersion: {
            promptVersion: {
              id: "UHJvbXB0VmVyc2lvbjoxMjM=",
            },
          },
        },
      });

    const result = await pushPrompt(defaultParams);

    expect(result).toEqual({
      action: "updated",
      promptId: mockRawPrompt.id,
      name: "test-prompt",
      versionId: "UHJvbXB0VmVyc2lvbjoxMjM=",
    });
  });

  it("should propagate GraphQL errors from the mutation", async () => {
    // First call: lookup returns empty edges (prompt not found)
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              edges: [],
            },
          },
        },
      });

    // Second call: createPrompt mutation returns a GraphQL error
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        errors: [{ message: "Internal server error" }],
      });

    await expect(pushPrompt(defaultParams)).rejects.toThrow(
      "Internal server error",
    );
  });

  it("should return 'unchanged' when messages and params match existing prompt", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              edges: [
                {
                  node: {
                    ...mockRawPrompt,
                    modelName: "gpt-4",
                    llmParameters: { temperature: 0.7 },
                  },
                },
              ],
            },
          },
        },
      });

    const result = await pushPrompt({
      ...defaultParams,
      model: "gpt-4",
      invocationParams: { temperature: 0.7 },
    });

    expect(result).toEqual({
      action: "unchanged",
      promptId: mockRawPrompt.id,
      name: "test-prompt",
    });
  });

  it("should return 'updated' when messages differ", async () => {
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

    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          createPromptVersion: {
            promptVersion: { id: "UHJvbXB0VmVyc2lvbjoxMjM=" },
          },
        },
      });

    const result = await pushPrompt({
      ...defaultParams,
      messages: [{ role: "system" as const, content: "You are a pirate" }],
      model: "gpt-4",
      invocationParams: { temperature: 0.7 },
    });

    expect(result).toEqual({
      action: "updated",
      promptId: mockRawPrompt.id,
      name: "test-prompt",
      versionId: "UHJvbXB0VmVyc2lvbjoxMjM=",
    });
  });

  it("should return 'updated' when model differs", async () => {
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

    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          createPromptVersion: {
            promptVersion: { id: "UHJvbXB0VmVyc2lvbjoxMjM=" },
          },
        },
      });

    const result = await pushPrompt({
      ...defaultParams,
      model: "gpt-5-turbo",
      invocationParams: { temperature: 0.7 },
    });

    expect(result).toEqual({
      action: "updated",
      promptId: mockRawPrompt.id,
      name: "test-prompt",
      versionId: "UHJvbXB0VmVyc2lvbjoxMjM=",
    });
  });

  it("should return 'updated' when invocationParams differ", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              edges: [
                {
                  node: {
                    ...mockRawPrompt,
                    llmParameters: { temperature: 0.7 },
                  },
                },
              ],
            },
          },
        },
      });

    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          createPromptVersion: {
            promptVersion: { id: "UHJvbXB0VmVyc2lvbjoxMjM=" },
          },
        },
      });

    const result = await pushPrompt({
      ...defaultParams,
      model: "gpt-4",
      invocationParams: { temperature: 0.9 },
    });

    expect(result).toEqual({
      action: "updated",
      promptId: mockRawPrompt.id,
      name: "test-prompt",
      versionId: "UHJvbXB0VmVyc2lvbjoxMjM=",
    });
  });

  it("should return 'unchanged' when model is undefined and existing modelName is null", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              edges: [
                {
                  node: {
                    ...mockRawPrompt,
                    modelName: null,
                    llmParameters: {},
                  },
                },
              ],
            },
          },
        },
      });

    const result = await pushPrompt({
      ...defaultParams,
      invocationParams: {},
    });

    expect(result).toEqual({
      action: "unchanged",
      promptId: mockRawPrompt.id,
      name: "test-prompt",
    });
  });

  it("should propagate non-'not found' errors from lookup", async () => {
    // First call: lookup returns a GraphQL error (e.g. auth failure)
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        errors: [{ message: "Unauthorized" }],
      });

    await expect(pushPrompt(defaultParams)).rejects.toThrow("Unauthorized");
  });
});
