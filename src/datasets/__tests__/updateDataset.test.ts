import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { mockDataset } from "./fixtures";
import { updateDataset } from "../updateDataset";

describe("updateDataset", () => {
  const patch = vi.fn();

  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patch.mockReset();
    patch.mockResolvedValue({
      error: undefined,
      data: mockDataset,
    });
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(
      "resolved-dataset-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("calls PATCH with name in body", async () => {
    await updateDataset({
      client: mockClient,
      dataset: "my-dataset",
      name: "Renamed Dataset",
    });

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledWith("/v2/datasets/{dataset_id}", {
      params: { path: { dataset_id: "resolved-dataset-id" } },
      body: { name: "Renamed Dataset" },
    });
  });

  it("returns transformed dataset on success", async () => {
    const result = await updateDataset({
      client: mockClient,
      dataset: "my-dataset",
      name: "Renamed Dataset",
    });

    expect(result).toMatchObject({
      id: "test-dataset-id",
      name: "test-dataset",
      spaceId: "test-space-id",
    });
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it("resolves dataset by name using space ref", async () => {
    await updateDataset({
      client: mockClient,
      dataset: "my-dataset",
      space: "my-space",
      name: "Renamed Dataset",
    });

    expect(resolveModule.toSpaceRef).toHaveBeenCalledWith("my-space");
    expect(resolveModule.findDatasetId).toHaveBeenCalledWith(
      mockClient,
      "my-dataset",
      { spaceId: undefined, spaceName: undefined },
    );
  });

  it("throws when API returns error", async () => {
    patch.mockResolvedValue({
      error: { detail: "not found", title: "Error" },
      data: undefined,
    });

    await expect(
      updateDataset({
        client: mockClient,
        dataset: "my-dataset",
        name: "Renamed Dataset",
      }),
    ).rejects.toThrow("not found");
  });
});
