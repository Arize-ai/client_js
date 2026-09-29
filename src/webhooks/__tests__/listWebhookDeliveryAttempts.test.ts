import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { NotFoundError } from "../../errors";
import { listWebhookDeliveryAttempts } from "../listWebhookDeliveryAttempts";
import {
  BASE_URL,
  ORGANIZATION_ID,
  WEBHOOK_ID,
  mockRawDeliveryAttempt,
  mockRawWebhook,
} from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("listWebhookDeliveryAttempts", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("GETs /v2/webhooks/{webhook_id}/delivery-attempts with limit and cursor and maps the page", async () => {
    const checkWarning = captureAlphaWarning("listWebhookDeliveryAttempts");
    let capturedQuery: Record<string, string> = {};
    nock(BASE_URL)
      .get(`/v2/webhooks/${WEBHOOK_ID}/delivery-attempts`)
      .query((query) => {
        capturedQuery = query as Record<string, string>;
        return true;
      })
      .reply(200, {
        delivery_attempts: [mockRawDeliveryAttempt],
        pagination: { next_cursor: "next", has_more: true },
      });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listWebhookDeliveryAttempts({
      client,
      webhook: WEBHOOK_ID,
      limit: 500,
      cursor: "page",
    });

    expect(capturedQuery).toEqual({ limit: "500", cursor: "page" });
    expect(result.data).toEqual([
      {
        eventId: "evt_001",
        attemptNumber: 2,
        payload: mockRawDeliveryAttempt.payload,
        statusCode: null,
        errorMessage: "timed out",
        createdAt: new Date(mockRawDeliveryAttempt.created_at),
      },
    ]);
    expect(result.pagination).toEqual({ nextCursor: "next", hasMore: true });
    checkWarning();
  });

  it("defaults limit to 50", async () => {
    let capturedQuery: Record<string, string> = {};
    nock(BASE_URL)
      .get(`/v2/webhooks/${WEBHOOK_ID}/delivery-attempts`)
      .query((query) => {
        capturedQuery = query as Record<string, string>;
        return true;
      })
      .reply(200, { delivery_attempts: [], pagination: { has_more: false } });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listWebhookDeliveryAttempts({
      client,
      webhook: WEBHOOK_ID,
    });

    expect(capturedQuery).toEqual({ limit: "50" });
    expect(result.data).toEqual([]);
  });

  it("resolves a name within an organization before listing", async () => {
    nock(BASE_URL)
      .get("/v2/webhooks")
      .query({ org_id: ORGANIZATION_ID, name: "deploy-notifier", limit: "100" })
      .reply(200, {
        webhooks: [mockRawWebhook],
        pagination: { has_more: false },
      });
    nock(BASE_URL)
      .get(`/v2/webhooks/${WEBHOOK_ID}/delivery-attempts`)
      .query({ limit: "50" })
      .reply(200, {
        delivery_attempts: [mockRawDeliveryAttempt],
        pagination: { has_more: false },
      });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listWebhookDeliveryAttempts({
      client,
      webhook: "deploy-notifier",
      organization: ORGANIZATION_ID,
    });

    expect(result.data).toHaveLength(1);
  });

  it("throws NotFoundError on 404", async () => {
    nock(BASE_URL)
      .get(`/v2/webhooks/${WEBHOOK_ID}/delivery-attempts`)
      .query(true)
      .reply(404, { status: 404, title: "Not Found" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      listWebhookDeliveryAttempts({ client, webhook: WEBHOOK_ID }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
