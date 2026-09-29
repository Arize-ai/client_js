import { beforeEach, describe, expect, it, vi } from "vitest";
import { listExperimentRuns } from "../listExperimentRuns";
import { DEFAULT_LIST_LIMIT } from "../../utils/pagination";
import { mockExperiment, mockExperimentRun } from "./fixtures";

const mockListResponse = {
  experiment_runs: [mockExperimentRun],
  pagination: { next_cursor: "next-cursor", has_more: true },
};

describe("listExperimentRuns", () => {
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
      data: mockListResponse,
    });
    // Resolve experiment by ID directly (base64 "Experiment:..." prefix skips lookup)
    get.mockResolvedValue({
      error: undefined,
      data: { experiment: mockExperiment },
    });
  });

  it("calls POST against the search endpoint with the correct body", async () => {
    const experimentId = btoa("Experiment:1:exp-abc");

    await listExperimentRuns({
      client: mockClient,
      experiment: experimentId,
      filter: "eval.quality.score < 0.5",
      limit: 10,
      cursor: "opaque-cursor",
    });

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(
      "/v2/experiments/{experiment_id}/runs/search",
      expect.objectContaining({
        params: { path: { experiment_id: experimentId } },
        body: {
          filter: "eval.quality.score < 0.5",
          limit: 10,
          cursor: "opaque-cursor",
        },
      }),
    );
  });

  it("returns transformed runs and pagination metadata", async () => {
    const experimentId = btoa("Experiment:1:exp-abc");

    const result = await listExperimentRuns({
      client: mockClient,
      experiment: experimentId,
      filter: "output = 'run_output'",
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toMatchObject({
      id: mockExperimentRun.id,
      exampleId: mockExperimentRun.example_id,
      output: mockExperimentRun.output,
    });
    expect(result.pagination).toEqual({
      nextCursor: "next-cursor",
      hasMore: true,
    });
  });

  it("defaults the limit and omits filter and cursor when not provided", async () => {
    const experimentId = btoa("Experiment:1:exp-abc");

    await listExperimentRuns({
      client: mockClient,
      experiment: experimentId,
    });

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(
      "/v2/experiments/{experiment_id}/runs/search",
      expect.objectContaining({
        params: { path: { experiment_id: experimentId } },
        body: {
          filter: undefined,
          limit: DEFAULT_LIST_LIMIT,
          cursor: undefined,
        },
      }),
    );
  });

  it("throws when the API returns an error", async () => {
    post.mockResolvedValue({
      error: { detail: "invalid filter", title: "Unprocessable Entity" },
      data: undefined,
    });

    const experimentId = btoa("Experiment:1:exp-abc");
    await expect(
      listExperimentRuns({
        client: mockClient,
        experiment: experimentId,
        filter: "eval.quality.score <",
      }),
    ).rejects.toThrow("invalid filter");
  });
});
