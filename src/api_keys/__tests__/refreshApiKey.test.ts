import { beforeEach, describe, expect, it, vi } from "vitest";
import { refreshApiKey } from "../refreshApiKey";
import { mockRawApiKey } from "./fixtures";

describe("refreshApiKey", () => {
  const post = vi.fn();

  const mockClient = {
    POST: post,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    post.mockReset();
    post.mockResolvedValue({
      error: undefined,
      data: mockRawApiKey,
    });
  });

  it("calls POST with apiKeyId and no body fields when only id is provided", async () => {
    await refreshApiKey({ client: mockClient, apiKeyId: "key-id-123" });

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(
      "/v2/api-keys/{api_key_id}/refresh",
      expect.objectContaining({
        params: { path: { api_key_id: "key-id-123" } },
        body: {},
      }),
    );
  });

  it("includes expires_at as ISO string when expiresAt is a Date", async () => {
    const expiresAt = new Date("2027-06-01T00:00:00Z");

    await refreshApiKey({
      client: mockClient,
      apiKeyId: "key-id-123",
      expiresAt,
    });

    expect(post).toHaveBeenCalledWith(
      "/v2/api-keys/{api_key_id}/refresh",
      expect.objectContaining({
        body: { expires_at: "2027-06-01T00:00:00.000Z" },
      }),
    );
  });

  it("passes expires_at through as-is when expiresAt is a string", async () => {
    await refreshApiKey({
      client: mockClient,
      apiKeyId: "key-id-123",
      expiresAt: "2027-06-01T00:00:00Z",
    });

    expect(post).toHaveBeenCalledWith(
      "/v2/api-keys/{api_key_id}/refresh",
      expect.objectContaining({
        body: { expires_at: "2027-06-01T00:00:00Z" },
      }),
    );
  });

  it("includes grace_period_seconds in the body when gracePeriodSeconds is provided", async () => {
    await refreshApiKey({
      client: mockClient,
      apiKeyId: "key-id-123",
      gracePeriodSeconds: 3600,
    });

    expect(post).toHaveBeenCalledWith(
      "/v2/api-keys/{api_key_id}/refresh",
      expect.objectContaining({
        body: { grace_period_seconds: 3600 },
      }),
    );
  });

  it("includes both expires_at and grace_period_seconds when both are provided", async () => {
    await refreshApiKey({
      client: mockClient,
      apiKeyId: "key-id-123",
      expiresAt: "2027-06-01T00:00:00Z",
      gracePeriodSeconds: 300,
    });

    expect(post).toHaveBeenCalledWith(
      "/v2/api-keys/{api_key_id}/refresh",
      expect.objectContaining({
        body: {
          expires_at: "2027-06-01T00:00:00Z",
          grace_period_seconds: 300,
        },
      }),
    );
  });

  it("sends grace_period_seconds: 0 when explicitly set to zero", async () => {
    await refreshApiKey({
      client: mockClient,
      apiKeyId: "key-id-123",
      gracePeriodSeconds: 0,
    });

    expect(post).toHaveBeenCalledWith(
      "/v2/api-keys/{api_key_id}/refresh",
      expect.objectContaining({
        body: { grace_period_seconds: 0 },
      }),
    );
  });

  it("omits grace_period_seconds from body when gracePeriodSeconds is not provided", async () => {
    await refreshApiKey({ client: mockClient, apiKeyId: "key-id-123" });

    const body = post.mock.calls[0]?.[1]?.body as Record<string, unknown>;
    expect(body).not.toHaveProperty("grace_period_seconds");
  });

  it("returns transformed ApiKey with camelCase fields", async () => {
    const result = await refreshApiKey({
      client: mockClient,
      apiKeyId: "key-id-123",
    });

    expect(result).toMatchObject({
      id: "key-id-123",
      name: "ci-key",
      keyType: "USER",
      status: "ACTIVE",
      createdByUserId: "user-123",
      key: "ak-full-secret-value",
    });
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.expiresAt).toBeInstanceOf(Date);
  });

  it("throws when the API returns an error", async () => {
    post.mockResolvedValue({
      error: { detail: "key not found", title: "Not Found" },
      data: undefined,
    });

    await expect(
      refreshApiKey({ client: mockClient, apiKeyId: "key-id-123" }),
    ).rejects.toThrow("key not found");
  });
});
