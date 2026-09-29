import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { listDatasetExamples } from "../listDatasetExamples";
import { mockListExamplesResponseExample } from "./fixtures";

describe("listDatasetExamples", () => {
  const post = vi.fn();

  const mockClient = {
    POST: post,
  } as never;

  const successResponse = {
    error: undefined,
    data: {
      examples: [mockListExamplesResponseExample],
      pagination: { has_more: false },
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    post.mockReset();
    post.mockResolvedValue(successResponse);
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(
      "resolved-dataset-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("calls the POST search endpoint without a filter", async () => {
    const result = await listDatasetExamples({
      client: mockClient,
      dataset: "my-dataset",
      space: "my-space",
      datasetVersionId: "my-version",
    });

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(
      "/v2/datasets/{dataset_id}/examples/search",
      {
        params: { path: { dataset_id: "resolved-dataset-id" } },
        body: {
          filter: undefined,
          limit: 50,
          cursor: undefined,
          dataset_version_id: "my-version",
        },
      },
    );
    expect(result.data).toHaveLength(1);
  });

  it("calls the POST search endpoint with filter in the body", async () => {
    const result = await listDatasetExamples({
      client: mockClient,
      dataset: "my-dataset",
      space: "my-space",
      datasetVersionId: "my-version",
      filter: "topic = 'arithmetic'",
      limit: 10,
      cursor: "opaque-cursor",
    });

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(
      "/v2/datasets/{dataset_id}/examples/search",
      {
        params: { path: { dataset_id: "resolved-dataset-id" } },
        body: {
          filter: "topic = 'arithmetic'",
          limit: 10,
          cursor: "opaque-cursor",
          dataset_version_id: "my-version",
        },
      },
    );
    expect(result.data).toHaveLength(1);
  });

  it("throws when the search API returns an error", async () => {
    post.mockResolvedValue({
      error: { detail: "invalid filter", title: "Error" },
      data: undefined,
    });

    await expect(
      listDatasetExamples({
        client: mockClient,
        dataset: "my-dataset",
        filter: "not a filter",
      }),
    ).rejects.toThrow("invalid filter");
  });
});
