import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { AuthorizationError } from "../../errors";
import { listWebhookSubscriptions } from "../listWebhookSubscriptions";
import { BASE_URL, PROMPT_ID, mockRawSubscription } from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("listWebhookSubscriptions", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("GETs /v2/webhook-subscriptions with source_type, source_id, limit, and cursor and maps the page", async () => {
    const checkWarning = captureAlphaWarning("listWebhookSubscriptions");
    let capturedQuery: Record<string, string> = {};
    nock(BASE_URL)
      .get("/v2/webhook-subscriptions")
      .query((query) => {
        capturedQuery = query as Record<string, string>;
        return true;
      })
      .reply(200, {
        subscriptions: [mockRawSubscription],
        pagination: { next_cursor: "next", has_more: true },
      });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listWebhookSubscriptions({
      client,
      sourceType: "PROMPT",
      sourceId: PROMPT_ID,
      limit: 10,
      cursor: "page",
    });

    expect(capturedQuery).toEqual({
      source_type: "PROMPT",
      source_id: PROMPT_ID,
      limit: "10",
      cursor: "page",
    });
    expect(result.data).toEqual([
      {
        id: mockRawSubscription.id,
        webhookId: mockRawSubscription.webhook_id,
        sourceType: "PROMPT",
        sourceId: PROMPT_ID,
        event: "PROMPT_VERSION_CREATED",
        createdAt: new Date(mockRawSubscription.created_at),
      },
    ]);
    expect(result.pagination).toEqual({ nextCursor: "next", hasMore: true });
    checkWarning();
  });

  it("sends only the default limit when unfiltered", async () => {
    let capturedQuery: Record<string, string> = {};
    nock(BASE_URL)
      .get("/v2/webhook-subscriptions")
      .query((query) => {
        capturedQuery = query as Record<string, string>;
        return true;
      })
      .reply(200, { subscriptions: [], pagination: { has_more: false } });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await listWebhookSubscriptions({ client });

    expect(capturedQuery).toEqual({ limit: "50" });
    expect(result.data).toEqual([]);
  });

  it("throws without calling the API when only sourceType is given", async () => {
    const scope = nock(BASE_URL)
      .get("/v2/webhook-subscriptions")
      .query(true)
      .reply(200, { subscriptions: [], pagination: { has_more: false } });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      listWebhookSubscriptions({ client, sourceType: "PROMPT" }),
    ).rejects.toThrow(/sourceType.*sourceId.*together/);
    expect(scope.isDone()).toBe(false);
  });

  it("throws without calling the API when only sourceId is given", async () => {
    const scope = nock(BASE_URL)
      .get("/v2/webhook-subscriptions")
      .query(true)
      .reply(200, { subscriptions: [], pagination: { has_more: false } });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      listWebhookSubscriptions({ client, sourceId: PROMPT_ID }),
    ).rejects.toThrow(/sourceType.*sourceId.*together/);
    expect(scope.isDone()).toBe(false);
  });

  it("throws AuthorizationError on 403", async () => {
    nock(BASE_URL)
      .get("/v2/webhook-subscriptions")
      .query(true)
      .reply(403, { status: 403, title: "Forbidden" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(listWebhookSubscriptions({ client })).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });
});
