import { beforeEach, describe, expect, it, vi } from "vitest";
import { appendExperimentRuns } from "../appendExperimentRuns";
import { mockExperiment } from "./fixtures";

const mockExperimentWithRunIds = {
  ...mockExperiment,
  run_ids: ["run-1", "run-2"],
};

describe("appendExperimentRuns", () => {
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
      data: mockExperimentWithRunIds,
    });
    // Resolve experiment by ID directly (base64 "Experiment:..." prefix skips lookup)
    get.mockResolvedValue({
      error: undefined,
      data: { experiment: mockExperiment },
    });
  });

  it("calls POST with the correct endpoint and body", async () => {
    const experimentId = btoa("Experiment:1:exp-abc");

    await appendExperimentRuns({
      client: mockClient,
      experiment: experimentId,
      experimentRuns: [
        { exampleId: "ex-1", output: "answer one" },
        { exampleId: "ex-2", output: "answer two" },
      ],
    });

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(
      "/v2/experiments/{experiment_id}/runs",
      expect.objectContaining({
        params: { path: { experiment_id: experimentId } },
        body: {
          experiment_runs: [
            { example_id: "ex-1", output: "answer one" },
            { example_id: "ex-2", output: "answer two" },
          ],
        },
      }),
    );
  });

  it("returns the experiment with runIds in input order", async () => {
    const experimentId = btoa("Experiment:1:exp-abc");

    const result = await appendExperimentRuns({
      client: mockClient,
      experiment: experimentId,
      experimentRuns: [
        { exampleId: "ex-1", output: "answer one" },
        { exampleId: "ex-2", output: "answer two" },
      ],
    });

    expect(result.runIds).toEqual(["run-1", "run-2"]);
    expect(result.id).toBe(mockExperiment.id);
    expect(result.name).toBe(mockExperiment.name);
  });

  it("accepts legacy snake_case example_id in run input", async () => {
    const experimentId = btoa("Experiment:1:exp-abc");

    await appendExperimentRuns({
      client: mockClient,
      experiment: experimentId,
      experimentRuns: [{ example_id: "ex-1", output: "answer" } as never],
    });

    const body = post.mock.calls[0]?.[1]?.body as Record<string, unknown>;
    const runs = body["experiment_runs"] as Array<Record<string, unknown>>;
    expect(runs[0]).toMatchObject({ example_id: "ex-1", output: "answer" });
  });

  it("throws when the API returns an error", async () => {
    post.mockResolvedValue({
      error: { detail: "experiment not found", title: "Not Found" },
      data: undefined,
    });

    const experimentId = btoa("Experiment:1:exp-abc");
    await expect(
      appendExperimentRuns({
        client: mockClient,
        experiment: experimentId,
        experimentRuns: [{ exampleId: "ex-1", output: "answer" }],
      }),
    ).rejects.toThrow("experiment not found");
  });
});
