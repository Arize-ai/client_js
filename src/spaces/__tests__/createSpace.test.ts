import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSpace } from "../createSpace";
import * as warningModule from "../../utils/warning";
import { mockSpace } from "./fixtures";

describe("createSpace", () => {
  const postFn = vi.fn();

  const mockClient = {
    POST: postFn,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    postFn.mockReset();
    postFn.mockResolvedValue({
      error: undefined,
      data: mockSpace,
    });
  });

  it("calls POST /v2/spaces with required params", async () => {
    await createSpace({
      client: mockClient,
      name: "my-space",
      organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
    });

    expect(postFn).toHaveBeenCalledTimes(1);
    expect(postFn).toHaveBeenCalledWith("/v2/spaces", {
      body: {
        name: "my-space",
        organization_id: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
        description: undefined,
        is_private: undefined,
      },
    });
  });

  it("forwards is_private: true in the POST body", async () => {
    await createSpace({
      client: mockClient,
      name: "priv-space",
      organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
      isPrivate: true,
    });

    expect(postFn).toHaveBeenCalledWith("/v2/spaces", {
      body: expect.objectContaining({ is_private: true }),
    });
  });

  it("forwards is_private: false in the POST body", async () => {
    await createSpace({
      client: mockClient,
      name: "pub-space",
      organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
      isPrivate: false,
    });

    expect(postFn).toHaveBeenCalledWith("/v2/spaces", {
      body: expect.objectContaining({ is_private: false }),
    });
  });

  it("emits private-space warning when isPrivate is true", async () => {
    const warnSpy = vi
      .spyOn(warningModule, "warnPrivateSpace")
      .mockImplementation(() => {});

    await createSpace({
      client: mockClient,
      name: "priv-space",
      organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
      isPrivate: true,
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith("createSpace");
  });

  it("does not emit private-space warning when isPrivate is false", async () => {
    const warnSpy = vi
      .spyOn(warningModule, "warnPrivateSpace")
      .mockImplementation(() => {});

    await createSpace({
      client: mockClient,
      name: "pub-space",
      organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
      isPrivate: false,
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("does not emit private-space warning when isPrivate is omitted", async () => {
    const warnSpy = vi
      .spyOn(warningModule, "warnPrivateSpace")
      .mockImplementation(() => {});

    await createSpace({
      client: mockClient,
      name: "my-space",
      organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("transforms response data correctly", async () => {
    const result = await createSpace({
      client: mockClient,
      name: "my-space",
      organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
    });

    expect(result).toMatchObject({
      id: mockSpace.id,
      name: mockSpace.name,
    });
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("throws when API returns an error", async () => {
    postFn.mockResolvedValue({
      error: { detail: "org not found", title: "Not Found" },
      data: undefined,
    });

    await expect(
      createSpace({
        client: mockClient,
        name: "my-space",
        organizationId: "T3JnYW5pemF0aW9uOmFiYzEyMw==",
      }),
    ).rejects.toThrow("org not found");
  });
});
