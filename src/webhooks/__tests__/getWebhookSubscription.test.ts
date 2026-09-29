import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { NotFoundError } from "../../errors";
import { getWebhookSubscription } from "../getWebhookSubscription";
import {
  BASE_URL,
  PROMPT_ID,
  SUBSCRIPTION_ID,
  WEBHOOK_ID,
  mockRawSubscription,
} from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("getWebhookSubscription", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("GETs /v2/webhook-subscriptions/{subscription_id} and maps the response", async () => {
    const checkWarning = captureAlphaWarning("getWebhookSubscription");
    nock(BASE_URL)
      .get(`/v2/webhook-subscriptions/${SUBSCRIPTION_ID}`)
      .reply(200, mockRawSubscription);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await getWebhookSubscription({
      client,
      subscriptionId: SUBSCRIPTION_ID,
    });

    expect(result).toEqual({
      id: SUBSCRIPTION_ID,
      webhookId: WEBHOOK_ID,
      sourceType: "PROMPT",
      sourceId: PROMPT_ID,
      event: "PROMPT_VERSION_CREATED",
      createdAt: new Date(mockRawSubscription.created_at),
    });
    checkWarning();
  });

  it("throws NotFoundError on 404", async () => {
    nock(BASE_URL)
      .get(`/v2/webhook-subscriptions/${SUBSCRIPTION_ID}`)
      .reply(404, { status: 404, title: "Not Found" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      getWebhookSubscription({ client, subscriptionId: SUBSCRIPTION_ID }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
