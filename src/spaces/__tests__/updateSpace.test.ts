import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import { updateSpace } from "../updateSpace";
import * as warningModule from "../../utils/warning";
import { mockSpace } from "./fixtures";

describe("updateSpace", () => {
  const patchFn = vi.fn();

  const mockClient = {
    PATCH: patchFn,
    GET: vi.fn(),
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patchFn.mockReset();
    patchFn.mockResolvedValue({
      error: undefined,
      data: mockSpace,
    });
    vi.spyOn(resolveModule, "findSpaceId").mockResolvedValue("test-space-id");
  });

  it("calls PATCH /v2/spaces/{space_id} with the resolved space ID", async () => {
    await updateSpace({
      client: mockClient,
      space: "my-space",
      name: "renamed",
    });

    expect(patchFn).toHaveBeenCalledTimes(1);
    expect(patchFn).toHaveBeenCalledWith("/v2/spaces/{space_id}", {
      params: { path: { space_id: "test-space-id" } },
      body: { name: "renamed", description: undefined, is_private: undefined },
    });
  });

  it("forwards description: null to clear the description", async () => {
    await updateSpace({
      client: mockClient,
      space: "my-space",
      description: null,
    });

    expect(patchFn).toHaveBeenCalledWith("/v2/spaces/{space_id}", {
      params: { path: { space_id: "test-space-id" } },
      body: {
        name: undefined,
        description: null,
        is_private: undefined,
      },
    });
  });

  it("forwards is_private: true in the PATCH body", async () => {
    await updateSpace({
      client: mockClient,
      space: "my-space",
      isPrivate: true,
    });

    expect(patchFn).toHaveBeenCalledWith("/v2/spaces/{space_id}", {
      params: { path: { space_id: "test-space-id" } },
      body: expect.objectContaining({ is_private: true }),
    });
  });

  it("forwards is_private: false in the PATCH body", async () => {
    await updateSpace({
      client: mockClient,
      space: "my-space",
      isPrivate: false,
    });

    expect(patchFn).toHaveBeenCalledWith("/v2/spaces/{space_id}", {
      params: { path: { space_id: "test-space-id" } },
      body: expect.objectContaining({ is_private: false }),
    });
  });

  it("emits private-space warning when isPrivate is true", async () => {
    const warnSpy = vi
      .spyOn(warningModule, "warnPrivateSpace")
      .mockImplementation(() => {});

    await updateSpace({
      client: mockClient,
      space: "my-space",
      isPrivate: true,
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith("updateSpace");
  });

  it("does not emit private-space warning when isPrivate is false", async () => {
    const warnSpy = vi
      .spyOn(warningModule, "warnPrivateSpace")
      .mockImplementation(() => {});

    await updateSpace({
      client: mockClient,
      space: "my-space",
      isPrivate: false,
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("does not emit private-space warning when isPrivate is omitted", async () => {
    const warnSpy = vi
      .spyOn(warningModule, "warnPrivateSpace")
      .mockImplementation(() => {});

    await updateSpace({
      client: mockClient,
      space: "my-space",
      name: "renamed",
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("transforms response data correctly", async () => {
    const result = await updateSpace({
      client: mockClient,
      space: "my-space",
      name: "renamed",
    });

    expect(result).toMatchObject({ id: mockSpace.id, name: mockSpace.name });
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("throws when API returns an error", async () => {
    patchFn.mockResolvedValue({
      error: { detail: "space not found", title: "Not Found" },
      data: undefined,
    });

    await expect(
      updateSpace({ client: mockClient, space: "my-space", name: "renamed" }),
    ).rejects.toThrow("space not found");
  });
});
