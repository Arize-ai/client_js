import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { deleteDatasetExamples } from "../deleteDatasetExamples";

describe("deleteDatasetExamples", () => {
  const del = vi.fn();

  const mockClient = {
    DELETE: del,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    del.mockReset();
    del.mockResolvedValue({
      error: undefined,
      data: {
        completed: true,
        deleted_example_ids: ["example-1", "example-2"],
        not_deleted_example_ids: ["example-3"],
      },
    });
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(
      "resolved-dataset-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("calls DELETE with version and example IDs in body", async () => {
    await deleteDatasetExamples({
      client: mockClient,
      dataset: "my-dataset",
      datasetVersionId: "my-version",
      examples: ["example-1", "example-2", "example-3"],
    });

    expect(del).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith("/v2/datasets/{dataset_id}/examples", {
      params: { path: { dataset_id: "resolved-dataset-id" } },
      body: {
        dataset_version_id: "my-version",
        example_ids: ["example-1", "example-2", "example-3"],
      },
    });
  });

  it("returns transformed result on success", async () => {
    const result = await deleteDatasetExamples({
      client: mockClient,
      dataset: "my-dataset",
      datasetVersionId: "my-version",
      examples: ["example-1", "example-2", "example-3"],
    });

    expect(result).toEqual({
      completed: true,
      deletedExampleIds: ["example-1", "example-2"],
      notDeletedExampleIds: ["example-3"],
    });
  });

  it("resolves dataset by name using space ref", async () => {
    await deleteDatasetExamples({
      client: mockClient,
      dataset: "my-dataset",
      space: "my-space",
      datasetVersionId: "my-version",
      examples: ["example-1"],
    });

    expect(resolveModule.toSpaceRef).toHaveBeenCalledWith("my-space");
    expect(resolveModule.findDatasetId).toHaveBeenCalledWith(
      mockClient,
      "my-dataset",
      { spaceId: undefined, spaceName: undefined },
    );
  });

  it("throws when examples is empty without calling the API", async () => {
    await expect(
      deleteDatasetExamples({
        client: mockClient,
        dataset: "my-dataset",
        datasetVersionId: "my-version",
        examples: [],
      }),
    ).rejects.toThrow("examples must not be empty");
    expect(del).not.toHaveBeenCalled();
  });

  it("throws when API returns error", async () => {
    del.mockResolvedValue({
      error: { detail: "not found", title: "Error" },
      data: undefined,
    });

    await expect(
      deleteDatasetExamples({
        client: mockClient,
        dataset: "my-dataset",
        datasetVersionId: "my-version",
        examples: ["example-1"],
      }),
    ).rejects.toThrow("not found");
  });
});
