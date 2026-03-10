import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { listPromptsWithContent } from "../listPromptsWithContent";
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

describe("listPromptsWithContent", () => {
  it("should list prompts with pagination", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              totalCount: 2,
              pageInfo: { hasNextPage: true, endCursor: "cursor_abc" },
              edges: [{ node: mockGraphQLPrompt }],
            },
          },
        },
      });

    const result = await listPromptsWithContent({
      spaceNodeId: "U3BhY2U6MTIz",
      first: 1,
      apiKey: API_KEY,
      baseUrl: BASE_URL,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]!.name).toBe("test-prompt");
    expect(result.data[0]!.createdAt).toBeInstanceOf(Date);
    expect(result.pagination.hasMore).toBe(true);
    expect(result.pagination.nextCursor).toBe("cursor_abc");
  });

  it("should handle empty results", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          node: {
            prompts: {
              totalCount: 0,
              pageInfo: { hasNextPage: false, endCursor: null },
              edges: [],
            },
          },
        },
      });

    const result = await listPromptsWithContent({
      spaceNodeId: "U3BhY2U6MTIz",
      apiKey: API_KEY,
      baseUrl: BASE_URL,
    });

    expect(result.data).toHaveLength(0);
    expect(result.pagination.hasMore).toBe(false);
    expect(result.pagination.nextCursor).toBeUndefined();
  });

  it("should throw when space not found", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, { data: { node: null } });

    await expect(
      listPromptsWithContent({
        spaceNodeId: "invalid",
        apiKey: API_KEY,
        baseUrl: BASE_URL,
      }),
    ).rejects.toThrow("Space not found");
  });
});
