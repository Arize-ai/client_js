import { describe, expect, it } from "vitest";
import {
  transformApiKey,
  transformCreatedApiKey,
  transformRefreshedApiKey,
} from "../utils";
import {
  mockRawApiKey,
  mockRawCreatedUserApiKey,
  mockRawRefreshedServiceApiKey,
  mockRawServiceApiKey,
} from "./fixtures";

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

  it("includes botUser for a service key", () => {
    const result = transformApiKey(mockRawServiceApiKey);
    expect(result.keyType).toBe("SERVICE");
    expect(result.botUser).toEqual({
      id: "bot-user-456",
      name: "bot-key",
      accountRole: { name: "MEMBER" },
      organizations: [
        {
          orgId: "T3JnMTIz",
          role: { name: "READ_ONLY" },
          spaces: [{ spaceId: "U3BhY2UxMjM", role: { name: "MEMBER" } }],
        },
      ],
    });
  });

  it("omits botUser for a user key", () => {
    const result = transformApiKey(mockRawApiKey);
    expect(result.botUser).toBeUndefined();
  });
});

describe("transformCreatedApiKey", () => {
  it("includes the raw key value alongside the transformed ApiKey fields", () => {
    const result = transformCreatedApiKey(mockRawCreatedUserApiKey);

    expect(result.key).toBe("ak-full-secret-value");
    expect(result.keyType).toBe("USER");
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});

describe("transformRefreshedApiKey", () => {
  it("maps fields and includes the new key value", () => {
    const result = transformRefreshedApiKey(mockRawRefreshedServiceApiKey);

    expect(result).toMatchObject({
      id: "key-id-456",
      name: "bot-key",
      keyType: "SERVICE",
      status: "ACTIVE",
      redactedKey: "ak-new...def",
      createdByUserId: "user-123",
      key: "ak-refreshed-secret",
    });
    expect(result.createdAt).toEqual(new Date("2026-01-01T00:00:00.000Z"));
    expect(result.expiresAt).toEqual(new Date("2027-01-01T00:00:00.000Z"));
  });

  it("does not include botUser", () => {
    const result = transformRefreshedApiKey(mockRawRefreshedServiceApiKey);
    expect(result).not.toHaveProperty("botUser");
  });
});
