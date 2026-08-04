import { beforeEach, describe, expect, it, vi } from "vitest";
import { createExperiment } from "../createExperiment";
import { mockExperiment } from "./fixtures";

describe("createExperiment", () => {
  const post = vi.fn();
  const get = vi.fn();

  const mockClient = {
    POST: post,
    GET: get,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    post.mockReset();
    get.mockReset();
    post.mockResolvedValue({
      error: undefined,
      data: mockExperiment,
    });
  });

  it("creates a dataset-backed experiment", async () => {
    const datasetId = btoa("Dataset:1:ds-abc");

    await createExperiment({
      client: mockClient,
      experimentName: "my-experiment",
      dataset: datasetId,
      experimentRuns: [{ exampleId: "ex-1", output: "answer" }],
    });

    expect(get).not.toHaveBeenCalled();
    expect(post).toHaveBeenCalledWith(
      "/v2/experiments",
      expect.objectContaining({
        body: {
          name: "my-experiment",
          dataset_id: datasetId,
          space_id: undefined,
          experiment_runs: [{ example_id: "ex-1", output: "answer" }],
        },
      }),
    );
  });

  it("creates a standalone experiment via space, omitting example_id", async () => {
    const spaceId = btoa("Space:1:sp-abc");

    await createExperiment({
      client: mockClient,
      experimentName: "my-experiment",
      space: spaceId,
      experimentRuns: [{ output: "answer" }],
    });

    expect(get).not.toHaveBeenCalled();
    expect(post).toHaveBeenCalledWith(
      "/v2/experiments",
      expect.objectContaining({
        body: {
          name: "my-experiment",
          dataset_id: undefined,
          space_id: spaceId,
          experiment_runs: [{ output: "answer" }],
        },
      }),
    );
  });

  it("throws when neither dataset nor space is provided", async () => {
    await expect(
      createExperiment({
        client: mockClient,
        experimentName: "my-experiment",
        experimentRuns: [{ output: "answer" }],
      }),
    ).rejects.toThrow(/dataset.*space|space.*dataset/i);
    expect(post).not.toHaveBeenCalled();
  });

  it("throws when the API returns an error", async () => {
    post.mockResolvedValue({
      error: { detail: "invalid request", title: "Bad Request" },
      data: undefined,
    });

    const spaceId = btoa("Space:1:sp-abc");
    await expect(
      createExperiment({
        client: mockClient,
        experimentName: "my-experiment",
        space: spaceId,
        experimentRuns: [{ output: "answer" }],
      }),
    ).rejects.toThrow("invalid request");
  });
});
