import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { AuthorizationError, NotFoundError } from "../../errors";
import { deleteWebhookSubscription } from "../deleteWebhookSubscription";
import { BASE_URL, SUBSCRIPTION_ID } from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("deleteWebhookSubscription", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("DELETEs /v2/webhook-subscriptions/{subscription_id} and resolves to undefined on 204", async () => {
    const checkWarning = captureAlphaWarning("deleteWebhookSubscription");
    const scope = nock(BASE_URL)
      .delete(`/v2/webhook-subscriptions/${SUBSCRIPTION_ID}`)
      .reply(204);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await deleteWebhookSubscription({
      client,
      subscriptionId: SUBSCRIPTION_ID,
    });

    expect(result).toBeUndefined();
    expect(scope.isDone()).toBe(true);
    checkWarning();
  });

  it("throws NotFoundError on 404", async () => {
    nock(BASE_URL)
      .delete(`/v2/webhook-subscriptions/${SUBSCRIPTION_ID}`)
      .reply(404, { status: 404, title: "Not Found" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      deleteWebhookSubscription({ client, subscriptionId: SUBSCRIPTION_ID }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws AuthorizationError on 403", async () => {
    nock(BASE_URL)
      .delete(`/v2/webhook-subscriptions/${SUBSCRIPTION_ID}`)
      .reply(403, { status: 403, title: "Forbidden" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      deleteWebhookSubscription({ client, subscriptionId: SUBSCRIPTION_ID }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
