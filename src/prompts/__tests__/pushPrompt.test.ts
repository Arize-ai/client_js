import { afterEach, describe, expect, it } from "vitest";
import nock from "nock";
import { pushPrompt } from "../pushPrompt";
import { mockGraphQLPrompt } from "./fixtures";

const BASE_URL = "https://app.arize.com";
const API_KEY = "test-api-key";

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
    nock(BASE_URL)
      .post("/graphql", (body) => body.query.includes("GetPromptByName"))
      .reply(200, {
        data: { node: { prompts: { edges: [] } } },
      });

    nock(BASE_URL)
      .post("/graphql", (body) => body.query.includes("CreatePrompt("))
      .reply(200, {
        data: {
          createPrompt: {
            prompt: { id: "UHJvbXB0OjEyMzQ1", name: "test-prompt" },
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
    nock(BASE_URL)
      .post("/graphql", (body) => body.query.includes("GetPromptByName"))
      .reply(200, {
        data: {
          node: { prompts: { edges: [{ node: mockGraphQLPrompt }] } },
        },
      });

    nock(BASE_URL)
      .post("/graphql", (body) => body.query.includes("CreatePromptVersion"))
      .reply(200, {
        data: {
          createPromptVersion: {
            promptVersion: { id: "UHJvbXB0VmVyc2lvbjoxMjM=" },
          },
        },
      });

    const result = await pushPrompt(defaultParams);

    expect(result).toEqual({
      action: "updated",
      promptId: mockGraphQLPrompt.id,
      name: "test-prompt",
    });
  });

  it("should pass description and tags on the create path", async () => {
    nock(BASE_URL)
      .post("/graphql", (body) => body.query.includes("GetPromptByName"))
      .reply(200, {
        data: { node: { prompts: { edges: [] } } },
      });

    nock(BASE_URL)
      .post("/graphql", (body) => {
        return (
          body.query.includes("CreatePrompt(") &&
          body.variables.description === "My description" &&
          body.variables.tags[0] === "tag1"
        );
      })
      .reply(200, {
        data: {
          createPrompt: {
            prompt: { id: "UHJvbXB0OjEyMzQ1", name: "test-prompt" },
          },
        },
      });

    const result = await pushPrompt({
      ...defaultParams,
      description: "My description",
      tags: ["tag1", "tag2"],
    });

    expect(result.action).toBe("created");
  });

  it("should transform messages to GraphQL format", async () => {
    nock(BASE_URL)
      .post("/graphql", (body) => body.query.includes("GetPromptByName"))
      .reply(200, {
        data: { node: { prompts: { edges: [] } } },
      });

    nock(BASE_URL)
      .post("/graphql", (body) => {
        const msg = body.variables.messages[0];
        return msg.role === "assistant" && msg.toolCallId === "tc_1";
      })
      .reply(200, {
        data: {
          createPrompt: {
            prompt: { id: "UHJvbXB0OjEyMzQ1", name: "test-prompt" },
          },
        },
      });

    await pushPrompt({
      ...defaultParams,
      messages: [
        {
          role: "assistant",
          content: "Hello",
          tool_call_id: "tc_1",
          tool_calls: [{ id: "tc_1", type: "function", function: { name: "test", arguments: "{}" } }],
        },
      ],
    });
  });

  it("should propagate GraphQL errors from the mutation", async () => {
    nock(BASE_URL)
      .post("/graphql", (body) => body.query.includes("GetPromptByName"))
      .reply(200, {
        data: { node: { prompts: { edges: [] } } },
      });

    nock(BASE_URL)
      .post("/graphql", (body) => body.query.includes("CreatePrompt("))
      .reply(200, {
        errors: [{ message: "Internal server error" }],
      });

    await expect(pushPrompt(defaultParams)).rejects.toThrow(
      "Internal server error",
    );
  });

  it("should propagate errors from the lookup", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        errors: [{ message: "Unauthorized" }],
      });

    await expect(pushPrompt(defaultParams)).rejects.toThrow("Unauthorized");
  });

  it("should NOT swallow errors containing 'not found' from unrelated failures", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        errors: [{ message: "GraphQL errors: Field 'commitHash' not found on type Prompt" }],
      });

    await expect(pushPrompt(defaultParams)).rejects.toThrow("not found");
  });
});
