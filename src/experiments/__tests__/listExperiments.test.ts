import { beforeEach, describe, expect, it, vi } from "vitest";
import { listExperiments } from "../listExperiments";
import { mockExperiment } from "./fixtures";

const SPACE_ID = btoa("Space:1:sp-abc");
const DATASET_ID = btoa("Dataset:1:ds-abc");

describe("listExperiments", () => {
  const get = vi.fn();
  const mockClient = { GET: get } as never;

  /** The query object sent on the nth GET call (1-indexed). */
  const queryOf = (n = 1) =>
    (
      get.mock.calls[n - 1]?.[1] as {
        params: { query: Record<string, unknown> };
      }
    ).params.query;

  const experimentsPage = {
    error: undefined,
    data: {
      experiments: [mockExperiment],
      pagination: { has_more: false, next_cursor: null },
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    get.mockReset();
    get.mockResolvedValue(experimentsPage);
  });

  it("filters by space_id when only a space ID is given", async () => {
    await listExperiments({ client: mockClient, space: SPACE_ID });

    expect(get).toHaveBeenCalledTimes(1);
    expect(queryOf()).toMatchObject({
      space_id: SPACE_ID,
      dataset_id: undefined,
    });
  });

  it("resolves a space name to an ID before filtering", async () => {
    get.mockReset();
    get
      .mockResolvedValueOnce({
        error: undefined,
        data: {
          spaces: [{ id: SPACE_ID, name: "my-space" }],
          pagination: { has_more: false, next_cursor: null },
        },
      })
      .mockResolvedValueOnce(experimentsPage);

    await listExperiments({ client: mockClient, space: "my-space" });

    expect(get).toHaveBeenNthCalledWith(1, "/v2/spaces", expect.anything());
    expect(get).toHaveBeenNthCalledWith(
      2,
      "/v2/experiments",
      expect.anything(),
    );
    expect(queryOf(2)).toMatchObject({
      space_id: SPACE_ID,
      dataset_id: undefined,
    });
  });

  it("sends dataset_id and no space_id when both are given", async () => {
    await listExperiments({
      client: mockClient,
      dataset: DATASET_ID,
      space: SPACE_ID,
    });

    expect(queryOf()).toMatchObject({
      dataset_id: DATASET_ID,
      space_id: undefined,
    });
  });

  it("sends neither scope when neither is given", async () => {
    await listExperiments({ client: mockClient });

    expect(queryOf()).toMatchObject({
      dataset_id: undefined,
      space_id: undefined,
    });
  });

  it("transforms the returned experiments", async () => {
    const result = await listExperiments({
      client: mockClient,
      space: SPACE_ID,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.spaceId).toBe(mockExperiment.space_id);
    expect(result.data[0]?.createdAt).toBeInstanceOf(Date);
  });

  it("throws when the API returns an error", async () => {
    get.mockResolvedValue({
      error: { detail: "space not found", title: "Not Found" },
      data: undefined,
    });

    await expect(
      listExperiments({ client: mockClient, space: SPACE_ID }),
    ).rejects.toThrow("space not found");
  });
});
