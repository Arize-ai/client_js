import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { AuthorizationError, NotFoundError } from "../../errors";
import { deleteWebhook } from "../deleteWebhook";
import {
  BASE_URL,
  ORGANIZATION_ID,
  WEBHOOK_ID,
  mockRawWebhook,
} from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("deleteWebhook", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("DELETEs /v2/webhooks/{webhook_id} and resolves to undefined on 204", async () => {
    const checkWarning = captureAlphaWarning("deleteWebhook");
    const scope = nock(BASE_URL)
      .delete(`/v2/webhooks/${WEBHOOK_ID}`)
      .reply(204);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await deleteWebhook({ client, webhook: WEBHOOK_ID });

    expect(result).toBeUndefined();
    expect(scope.isDone()).toBe(true);
    checkWarning();
  });

  it("resolves a name within an organization before deleting", async () => {
    nock(BASE_URL)
      .get("/v2/webhooks")
      .query({ org_id: ORGANIZATION_ID, name: "deploy-notifier", limit: "100" })
      .reply(200, {
        webhooks: [mockRawWebhook],
        pagination: { has_more: false },
      });
    const scope = nock(BASE_URL)
      .delete(`/v2/webhooks/${WEBHOOK_ID}`)
      .reply(204);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await deleteWebhook({
      client,
      webhook: "deploy-notifier",
      organization: ORGANIZATION_ID,
    });

    expect(scope.isDone()).toBe(true);
  });

  it("throws NotFoundError on 404", async () => {
    nock(BASE_URL)
      .delete(`/v2/webhooks/${WEBHOOK_ID}`)
      .reply(404, { status: 404, title: "Not Found" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      deleteWebhook({ client, webhook: WEBHOOK_ID }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws AuthorizationError on 403", async () => {
    nock(BASE_URL)
      .delete(`/v2/webhooks/${WEBHOOK_ID}`)
      .reply(403, { status: 403, title: "Forbidden" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      deleteWebhook({ client, webhook: WEBHOOK_ID }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
