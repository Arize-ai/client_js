import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { getPromptByLabel } from "../getPromptByLabel";
import { mockGraphQLPrompt, mockGraphQLPromptVersion } from "./fixtures";

const BASE_URL = "https://app.arize.com";
const API_KEY = "test-api-key";

beforeEach(() => {
  nock.disableNetConnect();
});

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

const defaultParams = {
  promptName: mockGraphQLPrompt.name,
  spaceNodeId: "U3BhY2U6MTIz",
  label: "production",
  apiKey: API_KEY,
  baseUrl: BASE_URL,
};

const mockGraphQLPromptWithVersions = {
  ...mockGraphQLPrompt,
  versionHistory: {
    edges: [{ node: mockGraphQLPromptVersion }],
  },
};

describe("getPromptByLabel", () => {
  it("should find the version matching the given label and return merged prompt", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              edges: [{ node: mockGraphQLPromptWithVersions }],
            },
          },
        },
      });

    const result = await getPromptByLabel(defaultParams);

    expect(result.id).toBe(mockGraphQLPrompt.id);
    expect(result.name).toBe(mockGraphQLPrompt.name);
    expect(result.versionId).toBe(mockGraphQLPromptVersion.id);
    expect(result.labels).toContain("production");
    expect(result.commitHash).toBe(mockGraphQLPromptVersion.commitHash);
    expect(result.providerParameters).toEqual(
      mockGraphQLPromptVersion.providerParameters,
    );
    // updatedAt should come from the prompt-level base, not the version createdAt
    expect(result.updatedAt).toEqual(new Date(mockGraphQLPrompt.updatedAt));
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("should throw when the prompt is not found in the space", async () => {
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

    await expect(getPromptByLabel(defaultParams)).rejects.toThrow(
      `Prompt "${defaultParams.promptName}" not found in space ${defaultParams.spaceNodeId}`,
    );
  });

  it("should throw when no version with the given label exists", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              edges: [
                {
                  node: {
                    ...mockGraphQLPrompt,
                    versionHistory: {
                      edges: [
                        {
                          node: {
                            ...mockGraphQLPromptVersion,
                            labels: ["staging"],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      });

    await expect(
      getPromptByLabel({ ...defaultParams, label: "nonexistent" }),
    ).rejects.toThrow(
      `No version with label "nonexistent" for prompt "${defaultParams.promptName}"`,
    );
  });

  it("should propagate GraphQL errors", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        errors: [{ message: "Unauthorized" }],
      });

    await expect(getPromptByLabel(defaultParams)).rejects.toThrow(
      "Unauthorized",
    );
  });
});
