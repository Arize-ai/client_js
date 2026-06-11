import { beforeEach, describe, expect, it, vi } from "vitest";
import { revokeApiKey } from "../revokeApiKey";

describe("revokeApiKey", () => {
  const put = vi.fn();

  const mockClient = {
    PUT: put,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    put.mockReset();
    put.mockResolvedValue({ error: undefined, data: undefined });
  });

  it("calls PUT with the apiKeyId path param", async () => {
    await revokeApiKey({ client: mockClient, apiKeyId: "key-id-123" });

    expect(put).toHaveBeenCalledTimes(1);
    expect(put).toHaveBeenCalledWith(
      "/v2/api-keys/{api_key_id}/revoke",
      expect.objectContaining({
        params: { path: { api_key_id: "key-id-123" } },
      }),
    );
  });

  it("resolves to undefined on success (204 No Content)", async () => {
    const result = await revokeApiKey({
      client: mockClient,
      apiKeyId: "key-id-123",
    });

    expect(result).toBeUndefined();
  });

  it("throws when the API returns an error", async () => {
    put.mockResolvedValue({
      error: { detail: "key not found", title: "Not Found" },
      data: undefined,
    });

    await expect(
      revokeApiKey({ client: mockClient, apiKeyId: "key-id-123" }),
    ).rejects.toThrow("key not found");
  });
});
