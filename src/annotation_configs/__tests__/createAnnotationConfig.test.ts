import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCategoricalAnnotationConfig,
  createContinuousAnnotationConfig,
  createFreeformAnnotationConfig,
} from "../createAnnotationConfig";

describe("createContinuousAnnotationConfig", () => {
  const postFn = vi.fn();
  const getFn = vi.fn();

  const mockClient = {
    POST: postFn,
    GET: getFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    postFn.mockReset();
    getFn.mockReset();
    getFn.mockResolvedValue({
      error: undefined,
      data: {
        spaces: [{ id: "space_123", name: "your_space" }],
        pagination: { next_cursor: undefined },
      },
    });
    postFn.mockResolvedValue({
      error: undefined,
      data: {
        id: "ac_2",
        name: "quality-score",
        created_at: "2026-01-01T00:00:00Z",
        space_id: "space_123",
        type: "CONTINUOUS",
        minimum_score: 0,
        maximum_score: 1,
        optimization_direction: "MAXIMIZE",
      },
    });
  });

  it("calls POST /v2/annotation-configs with a continuous body", async () => {
    await createContinuousAnnotationConfig({
      client: mockClient,
      name: "quality-score",
      space: "your_space",
      minimumScore: 0,
      maximumScore: 1,
      optimizationDirection: "MAXIMIZE",
    });

    expect(postFn).toHaveBeenCalledWith("/v2/annotation-configs", {
      body: {
        name: "quality-score",
        space_id: "space_123",
        annotation_config_type: "CONTINUOUS",
        minimum_score: 0,
        maximum_score: 1,
        optimization_direction: "MAXIMIZE",
      },
    });
  });

  it("transforms the response into a ContinuousAnnotationConfig", async () => {
    const result = await createContinuousAnnotationConfig({
      client: mockClient,
      name: "quality-score",
      space: "your_space",
      minimumScore: 0,
      maximumScore: 1,
    });

    expect(result).toEqual({
      id: "ac_2",
      name: "quality-score",
      createdAt: new Date("2026-01-01T00:00:00Z"),
      spaceId: "space_123",
      type: "CONTINUOUS",
      minimumScore: 0,
      maximumScore: 1,
      optimizationDirection: "MAXIMIZE",
    });
  });

  it("throws when the API returns an error", async () => {
    postFn.mockResolvedValue({
      error: { detail: "name already exists", title: "Conflict", status: 409 },
    });

    await expect(
      createContinuousAnnotationConfig({
        client: mockClient,
        name: "quality-score",
        space: "your_space",
        minimumScore: 0,
        maximumScore: 1,
      }),
    ).rejects.toThrow("name already exists");
  });
});

describe("createCategoricalAnnotationConfig", () => {
  const postFn = vi.fn();
  const getFn = vi.fn();

  const mockClient = {
    POST: postFn,
    GET: getFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    postFn.mockReset();
    getFn.mockReset();
    getFn.mockResolvedValue({
      error: undefined,
      data: {
        spaces: [{ id: "space_123", name: "your_space" }],
        pagination: { next_cursor: undefined },
      },
    });
    postFn.mockResolvedValue({
      error: undefined,
      data: {
        id: "ac_3",
        name: "correctness",
        created_at: "2026-01-01T00:00:00Z",
        space_id: "space_123",
        type: "CATEGORICAL",
        values: [
          { label: "correct", score: 1 },
          { label: "incorrect", score: 0 },
        ],
        optimization_direction: "MAXIMIZE",
      },
    });
  });

  it("calls POST /v2/annotation-configs with a categorical body", async () => {
    await createCategoricalAnnotationConfig({
      client: mockClient,
      name: "correctness",
      space: "your_space",
      values: [
        { label: "correct", score: 1 },
        { label: "incorrect", score: 0 },
      ],
      optimizationDirection: "MAXIMIZE",
    });

    expect(postFn).toHaveBeenCalledWith("/v2/annotation-configs", {
      body: {
        name: "correctness",
        space_id: "space_123",
        annotation_config_type: "CATEGORICAL",
        values: [
          { label: "correct", score: 1 },
          { label: "incorrect", score: 0 },
        ],
        optimization_direction: "MAXIMIZE",
      },
    });
  });

  it("transforms the response into a CategoricalAnnotationConfig", async () => {
    const result = await createCategoricalAnnotationConfig({
      client: mockClient,
      name: "correctness",
      space: "your_space",
      values: [
        { label: "correct", score: 1 },
        { label: "incorrect", score: 0 },
      ],
    });

    expect(result).toEqual({
      id: "ac_3",
      name: "correctness",
      createdAt: new Date("2026-01-01T00:00:00Z"),
      spaceId: "space_123",
      type: "CATEGORICAL",
      values: [
        { label: "correct", score: 1 },
        { label: "incorrect", score: 0 },
      ],
      optimizationDirection: "MAXIMIZE",
    });
  });

  it("throws when the API returns an error", async () => {
    postFn.mockResolvedValue({
      error: { detail: "name already exists", title: "Conflict", status: 409 },
    });

    await expect(
      createCategoricalAnnotationConfig({
        client: mockClient,
        name: "correctness",
        space: "your_space",
        values: [{ label: "correct", score: 1 }],
      }),
    ).rejects.toThrow("name already exists");
  });
});

describe("createFreeformAnnotationConfig", () => {
  const postFn = vi.fn();
  const getFn = vi.fn();

  const mockClient = {
    POST: postFn,
    GET: getFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    postFn.mockReset();
    getFn.mockReset();
    getFn.mockResolvedValue({
      error: undefined,
      data: {
        spaces: [{ id: "space_123", name: "your_space" }],
        pagination: { next_cursor: undefined },
      },
    });
    postFn.mockResolvedValue({
      error: undefined,
      data: {
        id: "ac_4",
        name: "reviewer-notes",
        created_at: "2026-01-01T00:00:00Z",
        space_id: "space_123",
        type: "FREEFORM",
      },
    });
  });

  it("calls POST /v2/annotation-configs with a freeform body", async () => {
    await createFreeformAnnotationConfig({
      client: mockClient,
      name: "reviewer-notes",
      space: "your_space",
    });

    expect(postFn).toHaveBeenCalledWith("/v2/annotation-configs", {
      body: {
        name: "reviewer-notes",
        space_id: "space_123",
        annotation_config_type: "FREEFORM",
      },
    });
  });

  it("transforms the response into a FreeformAnnotationConfig", async () => {
    const result = await createFreeformAnnotationConfig({
      client: mockClient,
      name: "reviewer-notes",
      space: "your_space",
    });

    expect(result).toEqual({
      id: "ac_4",
      name: "reviewer-notes",
      createdAt: new Date("2026-01-01T00:00:00Z"),
      spaceId: "space_123",
      type: "FREEFORM",
    });
  });

  it("throws when the API returns an error", async () => {
    postFn.mockResolvedValue({
      error: { detail: "name already exists", title: "Conflict", status: 409 },
    });

    await expect(
      createFreeformAnnotationConfig({
        client: mockClient,
        name: "reviewer-notes",
        space: "your_space",
      }),
    ).rejects.toThrow("name already exists");
  });
});
