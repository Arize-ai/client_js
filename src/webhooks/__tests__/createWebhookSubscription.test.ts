import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { APIError, ResolutionError } from "../../errors";
import { createWebhookSubscription } from "../createWebhookSubscription";
import {
  BASE_URL,
  ORGANIZATION_ID,
  PROMPT_ID,
  WEBHOOK_ID,
  mockRawSubscription,
  mockRawWebhook,
} from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("createWebhookSubscription", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("POSTs snake_case fields to /v2/webhook-subscriptions and maps the response", async () => {
    const checkWarning = captureAlphaWarning("createWebhookSubscription");
    let capturedBody: Record<string, unknown> = {};
    nock(BASE_URL)
      .post("/v2/webhook-subscriptions", (body) => {
        capturedBody = body as Record<string, unknown>;
        return true;
      })
      .reply(201, mockRawSubscription);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await createWebhookSubscription({
      client,
      webhook: WEBHOOK_ID,
      sourceType: "PROMPT",
      sourceId: PROMPT_ID,
      event: "PROMPT_VERSION_CREATED",
    });

    expect(capturedBody).toEqual({
      webhook_id: WEBHOOK_ID,
      source_type: "PROMPT",
      source_id: PROMPT_ID,
      event: "PROMPT_VERSION_CREATED",
    });
    expect(result).toEqual({
      id: mockRawSubscription.id,
      webhookId: WEBHOOK_ID,
      sourceType: "PROMPT",
      sourceId: PROMPT_ID,
      event: "PROMPT_VERSION_CREATED",
      createdAt: new Date(mockRawSubscription.created_at),
    });
    checkWarning();
  });

  it("resolves a webhook name within an organization before subscribing", async () => {
    nock(BASE_URL)
      .get("/v2/webhooks")
      .query({ org_id: ORGANIZATION_ID, name: "deploy-notifier", limit: "100" })
      .reply(200, {
        webhooks: [mockRawWebhook],
        pagination: { has_more: false },
      });
    nock(BASE_URL)
      .post(
        "/v2/webhook-subscriptions",
        (body) => (body as Record<string, unknown>).webhook_id === WEBHOOK_ID,
      )
      .reply(201, mockRawSubscription);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await createWebhookSubscription({
      client,
      webhook: "deploy-notifier",
      organization: ORGANIZATION_ID,
      sourceType: "PROMPT",
      sourceId: PROMPT_ID,
      event: "PROMPT_VERSION_CREATED",
    });

    expect(result.webhookId).toBe(WEBHOOK_ID);
  });

  it("throws ResolutionError when a webhook name is given without an organization", async () => {
    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      createWebhookSubscription({
        client,
        webhook: "deploy-notifier",
        sourceType: "PROMPT",
        sourceId: PROMPT_ID,
        event: "PROMPT_VERSION_CREATED",
      }),
    ).rejects.toBeInstanceOf(ResolutionError);
  });

  it("throws APIError with status 422 when the event does not match the source type", async () => {
    nock(BASE_URL).post("/v2/webhook-subscriptions").reply(422, {
      status: 422,
      title: "Unprocessable Entity",
      detail: "event does not apply to source_type",
    });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    let thrown: unknown;
    try {
      await createWebhookSubscription({
        client,
        webhook: WEBHOOK_ID,
        sourceType: "PROMPT",
        sourceId: PROMPT_ID,
        event: "EVALUATOR_VERSION_CREATED",
      });
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(APIError);
    expect((thrown as APIError).statusCode).toBe(422);
  });

  it("throws APIError with status 409 on a duplicate subscription", async () => {
    nock(BASE_URL)
      .post("/v2/webhook-subscriptions")
      .reply(409, { status: 409, title: "Conflict" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    let thrown: unknown;
    try {
      await createWebhookSubscription({
        client,
        webhook: WEBHOOK_ID,
        sourceType: "PROMPT",
        sourceId: PROMPT_ID,
        event: "PROMPT_VERSION_CREATED",
      });
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(APIError);
    expect((thrown as APIError).statusCode).toBe(409);
  });
});
