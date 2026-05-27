import { beforeEach, describe, expect, it, vi } from "vitest";
import { AmbiguousNameError, ResolutionError } from "../../errors";
import { findSpaceId } from "../resolve";

// A valid base64 resource ID — decodes to "Space:1:abc" which contains ":"
const SPACE_ID_1 = btoa("Space:1:abc");
const SPACE_ID_2 = btoa("Space:1:xyz");

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
