import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { NotFoundError, ResolutionError } from "../../errors";
import { getWebhook } from "../getWebhook";
import {
  BASE_URL,
  ORGANIZATION_ID,
  WEBHOOK_ID,
  mockRawWebhook,
} from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("getWebhook", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("GETs /v2/webhooks/{webhook_id} for an ID and maps the response", async () => {
    const checkWarning = captureAlphaWarning("getWebhook");
    nock(BASE_URL).get(`/v2/webhooks/${WEBHOOK_ID}`).reply(200, mockRawWebhook);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await getWebhook({ client, webhook: WEBHOOK_ID });

    expect(result).toEqual({
      id: WEBHOOK_ID,
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
    checkWarning();
  });

  it("resolves a name within an organization before fetching", async () => {
    nock(BASE_URL)
      .get("/v2/webhooks")
      .query({ org_id: ORGANIZATION_ID, name: "deploy-notifier", limit: "100" })
      .reply(200, {
        webhooks: [mockRawWebhook],
        pagination: { has_more: false },
      });
    nock(BASE_URL).get(`/v2/webhooks/${WEBHOOK_ID}`).reply(200, mockRawWebhook);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await getWebhook({
      client,
      webhook: "deploy-notifier",
      organization: ORGANIZATION_ID,
    });

    expect(result.id).toBe(WEBHOOK_ID);
  });

  it("throws ResolutionError when a name is given without an organization", async () => {
    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      getWebhook({ client, webhook: "deploy-notifier" }),
    ).rejects.toBeInstanceOf(ResolutionError);
  });

  it("throws NotFoundError on 404", async () => {
    nock(BASE_URL)
      .get(`/v2/webhooks/${WEBHOOK_ID}`)
      .reply(404, { status: 404, title: "Not Found" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      getWebhook({ client, webhook: WEBHOOK_ID }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
