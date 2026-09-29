import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { NotFoundError } from "../../errors";
import { listWebhooks } from "../listWebhooks";
import {
  BASE_URL,
  ORGANIZATION_ID,
  mockRawHmacWebhook,
  mockRawWebhook,
} from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("listWebhooks", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("GETs /v2/webhooks with org_id, name, limit, and cursor and maps the page", async () => {
    const checkWarning = captureAlphaWarning("listWebhooks");
    let capturedQuery: Record<string, string> = {};
    nock(BASE_URL)
      .get("/v2/webhooks")
      .query((query) => {
        capturedQuery = query as Record<string, string>;
        return true;
      })
      .reply(200, {
        webhooks: [mockRawWebhook, mockRawHmacWebhook],
        pagination: { next_cursor: "next", has_more: true },
      });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listWebhooks({
      client,
      organization: ORGANIZATION_ID,
      name: "notifier",
      limit: 10,
      cursor: "page",
    });

    expect(capturedQuery).toEqual({
      org_id: ORGANIZATION_ID,
      name: "notifier",
      limit: "10",
      cursor: "page",
    });
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({
      id: mockRawWebhook.id,
      organizationId: ORGANIZATION_ID,
      name: mockRawWebhook.name,
      description: mockRawWebhook.description,
      url: mockRawWebhook.url,
      authType: "BEARER",
      signingSecretHint: undefined,
      timeoutMs: 30000,
      createdAt: new Date(mockRawWebhook.created_at),
      updatedAt: new Date(mockRawWebhook.updated_at),
      createdByUserId: mockRawWebhook.created_by_user_id,
    });
    expect(result.data[1]!.signingSecretHint).toBe("whsec_…abcd");
    expect(result.pagination).toEqual({ nextCursor: "next", hasMore: true });
    checkWarning();
  });

  it("defaults limit to 50 and sends no organization filter", async () => {
    let capturedQuery: Record<string, string> = {};
    nock(BASE_URL)
      .get("/v2/webhooks")
      .query((query) => {
        capturedQuery = query as Record<string, string>;
        return true;
      })
      .reply(200, { webhooks: [], pagination: { has_more: false } });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listWebhooks({ client });

    expect(capturedQuery).toEqual({ limit: "50" });
    expect(result.data).toEqual([]);
    expect(result.pagination).toEqual({
      nextCursor: undefined,
      hasMore: false,
    });
  });

  it("treats an empty organization as no filter", async () => {
    let capturedQuery: Record<string, string> = {};
    nock(BASE_URL)
      .get("/v2/webhooks")
      .query((query) => {
        capturedQuery = query as Record<string, string>;
        return true;
      })
      .reply(200, { webhooks: [], pagination: { has_more: false } });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await listWebhooks({ client, organization: "" });

    expect(capturedQuery).toEqual({ limit: "50" });
  });

  it("resolves an organization name to org_id", async () => {
    nock(BASE_URL)
      .get("/v2/organizations")
      .query({ name: "my-org", limit: "100" })
      .reply(200, {
        organizations: [{ id: ORGANIZATION_ID, name: "my-org" }],
        pagination: { has_more: false },
      });
    nock(BASE_URL)
      .get("/v2/webhooks")
      .query({ org_id: ORGANIZATION_ID, limit: "50" })
      .reply(200, {
        webhooks: [mockRawWebhook],
        pagination: { has_more: false },
      });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listWebhooks({ client, organization: "my-org" });

    expect(result.data).toHaveLength(1);
  });

  it("throws NotFoundError when the organization is unknown", async () => {
    nock(BASE_URL).get("/v2/webhooks").query(true).reply(404, {
      status: 404,
      title: "Not Found",
      detail: "Organization not found",
    });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      listWebhooks({ client, organization: ORGANIZATION_ID }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
