import { describe, expect, it } from "vitest";
import { transformApiKey, transformApiKeyCreated } from "../utils";
import { mockRawApiKey, mockRawApiKeyCreated } from "./fixtures";

describe("transformApiKey", () => {
  it("maps snake_case fields to camelCase", () => {
    const result = transformApiKey(mockRawApiKey);

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
    const result = transformApiKey(mockRawApiKey);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt).toEqual(new Date("2026-01-01T00:00:00.000Z"));
  });

  it("converts expires_at to a Date when present", () => {
    const result = transformApiKey(mockRawApiKey);
    expect(result.expiresAt).toBeInstanceOf(Date);
    expect(result.expiresAt).toEqual(new Date("2027-01-01T00:00:00.000Z"));
  });

  it("sets expiresAt to undefined when expires_at is absent", () => {
    const { expires_at: _, ...withoutExpiry } = mockRawApiKey;
    const result = transformApiKey(withoutExpiry);
    expect(result.expiresAt).toBeUndefined();
  });
});

describe("transformApiKeyCreated", () => {
  it("includes the raw key value alongside the transformed ApiKey fields", () => {
    const result = transformApiKeyCreated(mockRawApiKeyCreated);

    expect(result.key).toBe("ak-full-secret-value");
    expect(result.keyType).toBe("USER");
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
