import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { setPromptVersionLabels } from "../setPromptVersionLabels";
import { mockGraphQLPromptVersion } from "./fixtures";

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
  versionId: mockGraphQLPromptVersion.id,
  labels: ["production", "latest"],
  apiKey: API_KEY,
  baseUrl: BASE_URL,
};

describe("setPromptVersionLabels", () => {
  it("should set labels on a prompt version and return id and labels", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        data: {
          patchPromptVersion: {
            promptVersion: {
              id: mockGraphQLPromptVersion.id,
              labels: defaultParams.labels,
            },
          },
        },
      });

    const result = await setPromptVersionLabels(defaultParams);

    expect(result.id).toBe(mockGraphQLPromptVersion.id);
    expect(result.labels).toEqual(defaultParams.labels);
  });

  it("should propagate GraphQL errors", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, {
        errors: [{ message: "Version not found" }],
      });

    await expect(setPromptVersionLabels(defaultParams)).rejects.toThrow(
      "Version not found",
    );
  });
});
