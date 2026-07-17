import { describe, expect, it } from "vitest";
import { transformApiKey, transformApiKeyRedacted } from "../utils";
import { mockRawApiKey, mockRawApiKeyRedacted } from "./fixtures";

describe("transformApiKeyRedacted", () => {
  it("maps snake_case fields to camelCase", () => {
    const result = transformApiKeyRedacted(mockRawApiKeyRedacted);

    expect(result).toMatchObject({
      id: "key-id-123",
      name: "ci-key",
      description: "CI pipeline key",
      keyType: "USER",
      status: "ACTIVE",
      redactedKey: "ak-abc...xyz",
      createdByUserId: "user-123",
    });
  });

  it("converts created_at to a Date", () => {
    const result = transformApiKeyRedacted(mockRawApiKeyRedacted);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt).toEqual(new Date("2026-01-01T00:00:00.000Z"));
  });

  it("converts expires_at to a Date when present", () => {
    const result = transformApiKeyRedacted(mockRawApiKeyRedacted);
    expect(result.expiresAt).toBeInstanceOf(Date);
    expect(result.expiresAt).toEqual(new Date("2027-01-01T00:00:00.000Z"));
  });

  it("sets expiresAt to undefined when expires_at is absent", () => {
    const { expires_at: _, ...withoutExpiry } = mockRawApiKeyRedacted;
    const result = transformApiKeyRedacted(withoutExpiry);
    expect(result.expiresAt).toBeUndefined();
  });
});

describe("transformApiKey", () => {
  it("includes the raw key value alongside the transformed ApiKeyRedacted fields", () => {
    const result = transformApiKey(mockRawApiKey);

    expect(result.key).toBe("ak-full-secret-value");
    expect(result.keyType).toBe("USER");
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
