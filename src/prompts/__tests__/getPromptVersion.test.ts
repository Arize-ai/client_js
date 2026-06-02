import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPromptVersion, mockVersionId } from "./fixtures";
import { getPromptVersion } from "../getPromptVersion";
import { transformPromptVersion } from "../utils";

describe("getPromptVersion", () => {
  const get = vi.fn();

  const mockClient = {
    GET: get,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    get.mockReset();
    get.mockResolvedValue({
      error: undefined,
      data: mockPromptVersion,
    });
  });

  it("calls GET with the version id and returns the transformed version", async () => {
    const result = await getPromptVersion({
      client: mockClient,
      versionId: mockVersionId,
    });

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("/v2/prompt-versions/{version_id}", {
      params: { path: { version_id: mockVersionId } },
    });
    expect(result).toEqual(transformPromptVersion(mockPromptVersion));
  });

  it("throws when API returns error", async () => {
    get.mockResolvedValue({
      error: { detail: "not found", title: "Error" },
      data: undefined,
    });

    await expect(
      getPromptVersion({
        client: mockClient,
        versionId: mockVersionId,
      }),
    ).rejects.toThrow("not found");
  });
});
