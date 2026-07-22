import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { warnPreRelease } from "../../utils/warning";
import { updateExamples } from "../updateExamples";
import { mockDatasetVersionWithExampleIds } from "./fixtures";

vi.mock("../../utils/warning", () => ({
  warnPreRelease: vi.fn(),
}));

describe("updateExamples", () => {
  const patch = vi.fn();
  const mockWarnPreRelease = vi.mocked(warnPreRelease);

  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patch.mockReset();
    patch.mockResolvedValue({
      error: undefined,
      data: mockDatasetVersionWithExampleIds,
    });
    mockWarnPreRelease.mockReset();
    vi.spyOn(resolveModule, "findDatasetId").mockResolvedValue(
      "resolved-dataset-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("calls PATCH with examples, dataset version, and new version", async () => {
    const examples = [
      {
        id: "example-1",
        question: "What is 2+2?",
        answer: "4",
      },
    ];

    await updateExamples({
      client: mockClient,
      dataset: "my-dataset",
      datasetVersionId: "version-1",
      examples,
      newVersion: "v2",
    });

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledWith("/v2/datasets/{dataset_id}/examples", {
      params: {
        path: { dataset_id: "resolved-dataset-id" },
        query: { dataset_version_id: "version-1" },
      },
      body: {
        examples,
        new_version: "v2",
      },
    });
  });

  it("omits optional query and new version when not provided", async () => {
    await updateExamples({
      client: mockClient,
      dataset: "my-dataset",
      examples: [{ id: "example-1", answer: "4" }],
    });

    expect(patch).toHaveBeenCalledWith("/v2/datasets/{dataset_id}/examples", {
      params: {
        path: { dataset_id: "resolved-dataset-id" },
        query: { dataset_version_id: undefined },
      },
      body: {
        examples: [{ id: "example-1", answer: "4" }],
        new_version: undefined,
      },
    });
  });

  it("returns transformed result on success", async () => {
    const result = await updateExamples({
      client: mockClient,
      dataset: "my-dataset",
      examples: [{ id: "example-1", answer: "4" }],
    });

    expect(result).toMatchObject({
      id: "test-dataset-id",
      name: "test-dataset",
      spaceId: "test-space-id",
      datasetVersionId: "test-version-id",
      exampleIds: ["test-example-id"],
    });
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it("resolves dataset by name using space ref", async () => {
    await updateExamples({
      client: mockClient,
      dataset: "my-dataset",
      space: "my-space",
      examples: [{ id: "example-1", answer: "4" }],
    });

    expect(resolveModule.toSpaceRef).toHaveBeenCalledWith("my-space");
    expect(resolveModule.findDatasetId).toHaveBeenCalledWith(
      mockClient,
      "my-dataset",
      { spaceId: undefined, spaceName: undefined },
    );
  });

  it("warns as a beta endpoint", async () => {
    await updateExamples({
      client: mockClient,
      dataset: "my-dataset",
      examples: [{ id: "example-1", answer: "4" }],
    });

    expect(mockWarnPreRelease).toHaveBeenCalledWith({
      functionName: "updateExamples",
      stage: "beta",
    });
  });

  it("throws when API returns error", async () => {
    patch.mockResolvedValue({
      error: { detail: "not found", title: "Error", status: 404 },
      data: undefined,
    });

    await expect(
      updateExamples({
        client: mockClient,
        dataset: "my-dataset",
        examples: [{ id: "example-1", answer: "4" }],
      }),
    ).rejects.toThrow("not found");
  });
});
