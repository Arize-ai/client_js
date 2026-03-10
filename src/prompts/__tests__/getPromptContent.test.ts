import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { getPromptContent } from "../getPromptContent";
import { mockGraphQLPrompt } from "./fixtures";

const BASE_URL = "https://app.arize.com";
const API_KEY = "test-api-key";

beforeEach(() => {
  nock.disableNetConnect();
});

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
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

    expect(result).not.toBeNull();
    if (!result) throw new Error("unreachable");
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

    expect(result).not.toBeNull();
    if (!result) throw new Error("unreachable");
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

  it("should return null when prompt not found by name", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: { node: { prompts: { edges: [] } } },
      });

    const result = await getPromptContent({
      promptName: "nonexistent",
      spaceNodeId: "U3BhY2U6MTIz",
      apiKey: API_KEY,
      baseUrl: BASE_URL,
    });

    expect(result).toBeNull();
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
