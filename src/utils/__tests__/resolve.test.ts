import { beforeEach, describe, expect, it, vi } from "vitest";
import { AmbiguousNameError, ResolutionError } from "../../errors";
import { findExperimentId, findSpaceId, findWebhookId } from "../resolve";

// A valid base64 resource ID — decodes to "Space:1:abc" which contains ":"
const SPACE_ID_1 = btoa("Space:1:abc");
const SPACE_ID_2 = btoa("Space:1:xyz");
const EXPERIMENT_ID_1 = btoa("Experiment:1:abc");
const EXPERIMENT_ID_2 = btoa("Experiment:1:xyz");
const ORGANIZATION_ID = btoa("Organization:1:abc");
const WEBHOOK_ID_1 = btoa("Webhook:1:abc");

describe("findSpaceId", () => {
  const getFn = vi.fn();
  const mockClient = { GET: getFn } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    getFn.mockReset();
  });

  it("returns a resource ID as-is without calling the API", async () => {
    const result = await findSpaceId(mockClient, SPACE_ID_1);
    expect(result).toBe(SPACE_ID_1);
    expect(getFn).not.toHaveBeenCalled();
  });

  it("resolves a name to a space ID", async () => {
    getFn.mockResolvedValue({
      data: {
        spaces: [{ id: SPACE_ID_1, name: "my-space" }],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    const result = await findSpaceId(mockClient, "my-space");
    expect(result).toBe(SPACE_ID_1);
  });

  it("throws ResolutionError when name is not found", async () => {
    getFn.mockResolvedValue({
      data: {
        spaces: [],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    await expect(findSpaceId(mockClient, "missing")).rejects.toBeInstanceOf(
      ResolutionError,
    );
  });

  it("throws AmbiguousNameError when multiple spaces share the same name", async () => {
    getFn.mockResolvedValue({
      data: {
        spaces: [
          { id: SPACE_ID_1, name: "shared-space" },
          { id: SPACE_ID_2, name: "shared-space" },
        ],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    let thrown: unknown;
    try {
      await findSpaceId(mockClient, "shared-space");
    } catch (e) {
      thrown = e;
    }

    expect(thrown).toBeInstanceOf(AmbiguousNameError);
    const err = thrown as AmbiguousNameError;
    expect(err.resourceType).toBe("space");
    expect(err.resourceName).toBe("shared-space");
    expect(err.matchingIds).toEqual([SPACE_ID_1, SPACE_ID_2]);
    expect(err.message).toContain("shared-space");
    expect(err.message).toContain("ID");
  });

  it("collects matches across pages before raising AmbiguousNameError", async () => {
    getFn
      .mockResolvedValueOnce({
        data: {
          spaces: [{ id: SPACE_ID_1, name: "shared-space" }],
          pagination: { has_more: true, next_cursor: "cursor1" },
        },
      })
      .mockResolvedValueOnce({
        data: {
          spaces: [{ id: SPACE_ID_2, name: "shared-space" }],
          pagination: { has_more: false, next_cursor: null },
        },
      });

    await expect(
      findSpaceId(mockClient, "shared-space"),
    ).rejects.toBeInstanceOf(AmbiguousNameError);
    expect(getFn).toHaveBeenCalledTimes(2);
  });
});

describe("findExperimentId", () => {
  const getFn = vi.fn();
  const mockClient = { GET: getFn } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    getFn.mockReset();
  });

  it("returns a resource ID as-is without calling the API", async () => {
    const result = await findExperimentId(mockClient, EXPERIMENT_ID_1);
    expect(result).toBe(EXPERIMENT_ID_1);
    expect(getFn).not.toHaveBeenCalled();
  });

  it("throws ResolutionError when neither datasetId nor space is given", async () => {
    await expect(
      findExperimentId(mockClient, "my-experiment"),
    ).rejects.toBeInstanceOf(ResolutionError);
    expect(getFn).not.toHaveBeenCalled();
  });

  it("resolves a name to an experiment ID within a dataset", async () => {
    getFn.mockResolvedValue({
      data: {
        experiments: [{ id: EXPERIMENT_ID_1, name: "my-experiment" }],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    const result = await findExperimentId(
      mockClient,
      "my-experiment",
      "dataset_id",
    );
    expect(result).toBe(EXPERIMENT_ID_1);
    expect(getFn).toHaveBeenCalledWith(
      "/v2/experiments",
      expect.objectContaining({
        params: {
          query: {
            dataset_id: "dataset_id",
            name: "my-experiment",
            limit: 100,
            cursor: undefined,
          },
        },
      }),
    );
  });

  it("resolves a standalone experiment by name via a space ID", async () => {
    getFn.mockResolvedValue({
      data: {
        experiments: [{ id: EXPERIMENT_ID_1, name: "my-experiment" }],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    const result = await findExperimentId(
      mockClient,
      "my-experiment",
      undefined,
      {
        spaceId: SPACE_ID_1,
      },
    );
    expect(result).toBe(EXPERIMENT_ID_1);
    expect(getFn).toHaveBeenCalledWith(
      "/v2/experiments",
      expect.objectContaining({
        params: {
          query: {
            space_id: SPACE_ID_1,
            name: "my-experiment",
            limit: 100,
            cursor: undefined,
          },
        },
      }),
    );
  });

  it("resolves a space name to an ID before searching by space", async () => {
    getFn
      .mockResolvedValueOnce({
        data: {
          spaces: [{ id: SPACE_ID_1, name: "my-space" }],
          pagination: { has_more: false, next_cursor: null },
        },
      })
      .mockResolvedValueOnce({
        data: {
          experiments: [{ id: EXPERIMENT_ID_1, name: "my-experiment" }],
          pagination: { has_more: false, next_cursor: null },
        },
      });

    const result = await findExperimentId(
      mockClient,
      "my-experiment",
      undefined,
      "my-space",
    );
    expect(result).toBe(EXPERIMENT_ID_1);
    expect(getFn).toHaveBeenNthCalledWith(1, "/v2/spaces", expect.anything());
    expect(getFn).toHaveBeenNthCalledWith(
      2,
      "/v2/experiments",
      expect.objectContaining({
        params: {
          query: {
            space_id: SPACE_ID_1,
            name: "my-experiment",
            limit: 100,
            cursor: undefined,
          },
        },
      }),
    );
  });

  it("throws AmbiguousNameError when a name collides across standalone and dataset-backed experiments in a space", async () => {
    getFn.mockResolvedValue({
      data: {
        experiments: [
          { id: EXPERIMENT_ID_1, name: "shared-name" },
          { id: EXPERIMENT_ID_2, name: "shared-name" },
        ],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    let thrown: unknown;
    try {
      await findExperimentId(mockClient, "shared-name", undefined, {
        spaceId: SPACE_ID_1,
      });
    } catch (e) {
      thrown = e;
    }

    expect(thrown).toBeInstanceOf(AmbiguousNameError);
    const err = thrown as AmbiguousNameError;
    expect(err.matchingIds).toEqual([EXPERIMENT_ID_1, EXPERIMENT_ID_2]);
  });

  it("collects matches across pages before raising AmbiguousNameError", async () => {
    getFn
      .mockResolvedValueOnce({
        data: {
          experiments: [{ id: EXPERIMENT_ID_1, name: "shared-name" }],
          pagination: { has_more: true, next_cursor: "cursor1" },
        },
      })
      .mockResolvedValueOnce({
        data: {
          experiments: [{ id: EXPERIMENT_ID_2, name: "shared-name" }],
          pagination: { has_more: false, next_cursor: null },
        },
      });

    let thrown: unknown;
    try {
      await findExperimentId(mockClient, "shared-name", undefined, {
        spaceId: SPACE_ID_1,
      });
    } catch (e) {
      thrown = e;
    }

    // A single match on page 1 must not short-circuit — uniqueness within a
    // space isn't guaranteed, so every page has to be read before deciding.
    expect(getFn).toHaveBeenCalledTimes(2);
    expect(thrown).toBeInstanceOf(AmbiguousNameError);
    expect((thrown as AmbiguousNameError).matchingIds).toEqual([
      EXPERIMENT_ID_1,
      EXPERIMENT_ID_2,
    ]);
  });

  it("resolves a single match found only on a later page", async () => {
    getFn
      .mockResolvedValueOnce({
        data: {
          experiments: [{ id: EXPERIMENT_ID_2, name: "other-name" }],
          pagination: { has_more: true, next_cursor: "cursor1" },
        },
      })
      .mockResolvedValueOnce({
        data: {
          experiments: [{ id: EXPERIMENT_ID_1, name: "my-experiment" }],
          pagination: { has_more: false, next_cursor: null },
        },
      });

    const result = await findExperimentId(
      mockClient,
      "my-experiment",
      undefined,
      { spaceId: SPACE_ID_1 },
    );
    expect(result).toBe(EXPERIMENT_ID_1);
    expect(getFn).toHaveBeenCalledTimes(2);
  });

  it("throws ResolutionError when the name is not found within the space", async () => {
    getFn.mockResolvedValue({
      data: {
        experiments: [],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    await expect(
      findExperimentId(mockClient, "missing", undefined, {
        spaceId: SPACE_ID_1,
      }),
    ).rejects.toBeInstanceOf(ResolutionError);
  });
});

describe("findWebhookId", () => {
  const getFn = vi.fn();
  const mockClient = { GET: getFn } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    getFn.mockReset();
  });

  it("returns a resource ID as-is without calling the API", async () => {
    const result = await findWebhookId(mockClient, WEBHOOK_ID_1);
    expect(result).toBe(WEBHOOK_ID_1);
    expect(getFn).not.toHaveBeenCalled();
  });

  it("throws ResolutionError with a hint when a name is given without an organization", async () => {
    let thrown: unknown;
    try {
      await findWebhookId(mockClient, "my-webhook");
    } catch (e) {
      thrown = e;
    }

    expect(thrown).toBeInstanceOf(ResolutionError);
    expect((thrown as ResolutionError).message).toContain("organization");
    expect(getFn).not.toHaveBeenCalled();
  });

  it("resolves a name within an organization ID using org_id and name filters", async () => {
    getFn.mockResolvedValue({
      data: {
        webhooks: [
          { id: btoa("Webhook:9:abc"), name: "my-webhook-staging" },
          { id: WEBHOOK_ID_1, name: "my-webhook" },
        ],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    const result = await findWebhookId(
      mockClient,
      "my-webhook",
      ORGANIZATION_ID,
    );

    expect(result).toBe(WEBHOOK_ID_1);
    expect(getFn).toHaveBeenCalledTimes(1);
    expect(getFn).toHaveBeenCalledWith("/v2/webhooks", {
      params: {
        query: {
          org_id: ORGANIZATION_ID,
          name: "my-webhook",
          limit: 100,
          cursor: undefined,
        },
      },
    });
  });

  it("resolves an organization name before listing webhooks", async () => {
    getFn
      .mockResolvedValueOnce({
        data: {
          organizations: [{ id: ORGANIZATION_ID, name: "my-org" }],
          pagination: { has_more: false, next_cursor: null },
        },
      })
      .mockResolvedValueOnce({
        data: {
          webhooks: [{ id: WEBHOOK_ID_1, name: "my-webhook" }],
          pagination: { has_more: false, next_cursor: null },
        },
      });

    const result = await findWebhookId(mockClient, "my-webhook", "my-org");

    expect(result).toBe(WEBHOOK_ID_1);
    expect(getFn).toHaveBeenNthCalledWith(1, "/v2/organizations", {
      params: { query: { name: "my-org", limit: 100, cursor: undefined } },
    });
    expect(getFn).toHaveBeenNthCalledWith(2, "/v2/webhooks", {
      params: {
        query: {
          org_id: ORGANIZATION_ID,
          name: "my-webhook",
          limit: 100,
          cursor: undefined,
        },
      },
    });
  });

  it("pages until an exact match is found", async () => {
    getFn
      .mockResolvedValueOnce({
        data: {
          webhooks: [{ id: btoa("Webhook:9:abc"), name: "my-webhook-2" }],
          pagination: { has_more: true, next_cursor: "cursor1" },
        },
      })
      .mockResolvedValueOnce({
        data: {
          webhooks: [{ id: WEBHOOK_ID_1, name: "my-webhook" }],
          pagination: { has_more: false, next_cursor: null },
        },
      });

    const result = await findWebhookId(
      mockClient,
      "my-webhook",
      ORGANIZATION_ID,
    );

    expect(result).toBe(WEBHOOK_ID_1);
    expect(getFn).toHaveBeenCalledTimes(2);
    expect(getFn.mock.calls[1]![1]).toEqual({
      params: {
        query: {
          org_id: ORGANIZATION_ID,
          name: "my-webhook",
          limit: 100,
          cursor: "cursor1",
        },
      },
    });
  });

  it("does not match case-insensitively or on substrings", async () => {
    getFn.mockResolvedValue({
      data: {
        webhooks: [
          { id: btoa("Webhook:9:abc"), name: "My-Webhook" },
          { id: btoa("Webhook:8:abc"), name: "my-webhook-2" },
        ],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    await expect(
      findWebhookId(mockClient, "my-webhook", ORGANIZATION_ID),
    ).rejects.toBeInstanceOf(ResolutionError);
  });

  it("lists the near misses in the ResolutionError", async () => {
    getFn.mockResolvedValue({
      data: {
        webhooks: [
          { id: btoa("Webhook:9:abc"), name: "my-webhook-staging" },
          { id: btoa("Webhook:8:abc"), name: "my-webhook-prod" },
        ],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    let thrown: unknown;
    try {
      await findWebhookId(mockClient, "my-webhook", ORGANIZATION_ID);
    } catch (e) {
      thrown = e;
    }

    expect(thrown).toBeInstanceOf(ResolutionError);
    const err = thrown as ResolutionError;
    expect(err.resourceType).toBe("webhook");
    expect(err.resourceName).toBe("my-webhook");
    expect(err.availableNames).toEqual([
      "my-webhook-staging",
      "my-webhook-prod",
    ]);
  });

  it("throws ResolutionError when the list is empty", async () => {
    getFn.mockResolvedValue({
      data: {
        webhooks: [],
        pagination: { has_more: false, next_cursor: null },
      },
    });

    await expect(
      findWebhookId(mockClient, "missing", ORGANIZATION_ID),
    ).rejects.toBeInstanceOf(ResolutionError);
  });
});
