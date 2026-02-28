import { afterEach, describe, expect, it } from "vitest";
import nock from "nock";
import { getPromptContent, findPromptByName } from "../getPromptContent";
import { mockGraphQLPrompt } from "./fixtures";

const BASE_URL = "https://app.arize.com";
const API_KEY = "test-api-key";

afterEach(() => {
  nock.cleanAll();
});

describe("getPromptContent", () => {
  it("should fetch prompt by node ID", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, { data: { node: mockGraphQLPrompt } });

    const result = await getPromptContent({
      promptNodeId: "UHJvbXB0OjMwNDQ2Olg1eVk=",
      apiKey: API_KEY,
      baseUrl: BASE_URL,
    });

    expect(result.id).toBe(mockGraphQLPrompt.id);
    expect(result.name).toBe(mockGraphQLPrompt.name);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("should fetch prompt by name and space ID", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              edges: [{ node: mockGraphQLPrompt }],
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

describe("findPromptByName", () => {
  it("should return the prompt when it exists", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              edges: [{ node: mockGraphQLPrompt }],
            },
          },
        },
      });

    const result = await findPromptByName({
      promptName: "test-prompt",
      spaceNodeId: "U3BhY2U6MTIz",
      apiKey: API_KEY,
      baseUrl: BASE_URL,
    });

    expect(result).not.toBeNull();
    expect(result!.name).toBe("test-prompt");
    expect(result!.createdAt).toBeInstanceOf(Date);
  });

  it("should return null when the prompt does not exist", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: { node: { prompts: { edges: [] } } },
      });

    const result = await findPromptByName({
      promptName: "nonexistent",
      spaceNodeId: "U3BhY2U6MTIz",
      apiKey: API_KEY,
      baseUrl: BASE_URL,
    });

    expect(result).toBeNull();
  });

  it("should propagate GraphQL errors", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        errors: [{ message: "Unauthorized" }],
      });

    await expect(
      findPromptByName({
        promptName: "test",
        spaceNodeId: "U3BhY2U6MTIz",
        apiKey: API_KEY,
        baseUrl: BASE_URL,
      }),
    ).rejects.toThrow("Unauthorized");
  });
});
