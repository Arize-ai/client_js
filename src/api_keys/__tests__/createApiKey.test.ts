import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApiKey } from "../createApiKey";
import { mockRawApiKeyCreated, mockRawServiceApiKeyCreated } from "./fixtures";

describe("createApiKey", () => {
  const post = vi.fn();

  const mockClient = {
    POST: post,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    post.mockReset();
  });

  describe("user key", () => {
    beforeEach(() => {
      post.mockResolvedValue({
        error: undefined,
        data: mockRawApiKeyCreated,
      });
    });

    it("sends key_type=user and name", async () => {
      await createApiKey({
        client: mockClient,
        keyType: "USER",
        name: "my-key",
      });

      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith(
        "/v2/api-keys",
        expect.objectContaining({
          body: expect.objectContaining({
            key_type: "USER",
            name: "my-key",
          }),
        }),
      );
    });

    it("includes expires_at as ISO string when expiresAt is a Date", async () => {
      const expiresAt = new Date("2027-06-01T00:00:00Z");

      await createApiKey({
        client: mockClient,
        keyType: "USER",
        name: "my-key",
        expiresAt,
      });

      expect(post).toHaveBeenCalledWith(
        "/v2/api-keys",
        expect.objectContaining({
          body: expect.objectContaining({
            expires_at: "2027-06-01T00:00:00.000Z",
          }),
        }),
      );
    });

    it("passes expires_at through as-is when expiresAt is a string", async () => {
      await createApiKey({
        client: mockClient,
        keyType: "USER",
        name: "my-key",
        expiresAt: "2027-06-01T00:00:00Z",
      });

      expect(post).toHaveBeenCalledWith(
        "/v2/api-keys",
        expect.objectContaining({
          body: expect.objectContaining({
            expires_at: "2027-06-01T00:00:00Z",
          }),
        }),
      );
    });

    it("returns transformed ApiKeyCreated with camelCase fields", async () => {
      const result = await createApiKey({
        client: mockClient,
        keyType: "USER",
        name: "my-key",
      });

      expect(result).toMatchObject({
        id: "key-id-123",
        name: "ci-key",
        keyType: "USER",
        status: "ACTIVE",
        redactedKey: "ak-abc...xyz",
        createdByUserId: "user-123",
        key: "ak-full-secret-value",
      });
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(result.botUser).toBeUndefined();
    });

    it("throws when the API returns an error", async () => {
      post.mockResolvedValue({
        error: { detail: "permission denied", title: "Forbidden" },
        data: undefined,
      });

      await expect(
        createApiKey({
          client: mockClient,
          keyType: "USER",
          name: "my-key",
        }),
      ).rejects.toThrow("permission denied");
    });
  });

  describe("service key", () => {
    beforeEach(() => {
      post.mockResolvedValue({
        error: undefined,
        data: mockRawServiceApiKeyCreated,
      });
    });

    it("rejects a malformed service-key call before sending a request", async () => {
      await expect(
        createApiKey({
          client: mockClient,
          keyType: "SERVICE",
          name: "bot-key",
        } as never),
      ).rejects.toThrow("organizations is required when keyType is SERVICE");

      expect(post).not.toHaveBeenCalled();
    });

    it("creates a service key from organizations and omits defaulted roles", async () => {
      await createApiKey({
        client: mockClient,
        keyType: "SERVICE",
        name: "bot-key",
        organizations: [
          {
            orgId: "T3JnMTIz",
            spaces: [{ spaceId: "U3BhY2UxMjM" }],
          },
        ],
      });

      expect(post).toHaveBeenCalledWith(
        "/v2/api-keys",
        expect.objectContaining({
          body: expect.objectContaining({
            key_type: "SERVICE",
            name: "bot-key",
            organizations: [
              expect.objectContaining({
                org_id: "T3JnMTIz",
                spaces: [
                  {
                    space_id: "U3BhY2UxMjM",
                  },
                ],
              }),
            ],
          }),
        }),
      );
      type ServiceBody = {
        organizations: [
          {
            spaces: [{ role?: unknown }];
          },
        ];
      };
      const body = post.mock.calls[0]?.[1]?.body as ServiceBody;
      expect(body.organizations[0].spaces[0]).not.toHaveProperty("role");
    });

    it("injects type=PREDEFINED for predefined space roles", async () => {
      await createApiKey({
        client: mockClient,
        keyType: "SERVICE",
        name: "bot-key",
        organizations: [
          {
            orgId: "T3JnMTIz",
            spaces: [{ spaceId: "U3BhY2UxMjM", role: { name: "READ_ONLY" } }],
          },
        ],
      });

      expect(post).toHaveBeenCalledWith(
        "/v2/api-keys",
        expect.objectContaining({
          body: expect.objectContaining({
            organizations: [
              expect.objectContaining({
                spaces: [
                  {
                    space_id: "U3BhY2UxMjM",
                    role: { name: "READ_ONLY", type: "PREDEFINED" },
                  },
                ],
              }),
            ],
          }),
        }),
      );
    });

    it("injects type=CUSTOM for custom space roles", async () => {
      await createApiKey({
        client: mockClient,
        keyType: "SERVICE",
        name: "bot-key",
        organizations: [
          {
            orgId: "T3JnMTIz",
            spaces: [
              { spaceId: "U3BhY2UxMjM", role: { id: "custom-role-id" } },
            ],
          },
        ],
      });

      expect(post).toHaveBeenCalledWith(
        "/v2/api-keys",
        expect.objectContaining({
          body: expect.objectContaining({
            organizations: [
              expect.objectContaining({
                spaces: [
                  {
                    space_id: "U3BhY2UxMjM",
                    role: { id: "custom-role-id", type: "CUSTOM" },
                  },
                ],
              }),
            ],
          }),
        }),
      );
    });

    it("sends org role when org role is provided", async () => {
      await createApiKey({
        client: mockClient,
        keyType: "SERVICE",
        name: "bot-key",
        organizations: [
          {
            orgId: "T3JnMTIz",
            role: { name: "READ_ONLY" },
            spaces: [{ spaceId: "U3BhY2UxMjM" }],
          },
        ],
      });

      expect(post).toHaveBeenCalledWith(
        "/v2/api-keys",
        expect.objectContaining({
          body: expect.objectContaining({
            organizations: [
              expect.objectContaining({
                org_id: "T3JnMTIz",
                role: { name: "READ_ONLY", type: "PREDEFINED" },
              }),
            ],
          }),
        }),
      );
    });

    it("sends account_role at top level when accountRole is provided", async () => {
      await createApiKey({
        client: mockClient,
        keyType: "SERVICE",
        name: "bot-key",
        accountRole: { name: "ADMIN" },
        organizations: [
          {
            orgId: "T3JnMTIz",
            spaces: [{ spaceId: "U3BhY2UxMjM" }],
          },
        ],
      });

      expect(post).toHaveBeenCalledWith(
        "/v2/api-keys",
        expect.objectContaining({
          body: expect.objectContaining({
            account_role: { name: "ADMIN", type: "PREDEFINED" },
          }),
        }),
      );
    });

    it("returns transformed ApiKeyCreated with botUser for service keys", async () => {
      const result = await createApiKey({
        client: mockClient,
        keyType: "SERVICE",
        name: "bot-key",
        organizations: [
          {
            orgId: "T3JnMTIz",
            spaces: [{ spaceId: "U3BhY2UxMjM" }],
          },
        ],
      });

      expect(result).toMatchObject({
        id: "key-id-456",
        name: "bot-key",
        keyType: "SERVICE",
        key: "ak-bot-full-secret",
      });
      expect(result.botUser).toMatchObject({
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

    it("throws when the API returns an error", async () => {
      post.mockResolvedValue({
        error: { detail: "space not found", title: "Not Found" },
        data: undefined,
      });

      await expect(
        createApiKey({
          client: mockClient,
          keyType: "SERVICE",
          name: "bot-key",
          organizations: [
            { orgId: "T3JnMTIz", spaces: [{ spaceId: "bad-id" }] },
          ],
        }),
      ).rejects.toThrow("space not found");
    });
  });
});
