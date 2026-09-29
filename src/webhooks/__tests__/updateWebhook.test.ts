import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { APIError } from "../../errors";
import { updateWebhook } from "../updateWebhook";
import {
  BASE_URL,
  ORGANIZATION_ID,
  WEBHOOK_ID,
  mockRawWebhook,
} from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("updateWebhook", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("PATCHes only the provided fields under their wire names", async () => {
    const checkWarning = captureAlphaWarning("updateWebhook");
    let capturedBody: Record<string, unknown> = {};
    nock(BASE_URL)
      .patch(`/v2/webhooks/${WEBHOOK_ID}`, (body) => {
        capturedBody = body as Record<string, unknown>;
        return true;
      })
      .reply(200, { ...mockRawWebhook, name: "renamed", timeout_ms: 5000 });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await updateWebhook({
      client,
      webhook: WEBHOOK_ID,
      name: "renamed",
      timeoutMs: 5000,
    });

    expect(capturedBody).toEqual({ name: "renamed", timeout_ms: 5000 });
    expect(result.name).toBe("renamed");
    expect(result.timeoutMs).toBe(5000);
    checkWarning();
  });

  it("sends auth_token and headers as replacements", async () => {
    let capturedBody: Record<string, unknown> = {};
    nock(BASE_URL)
      .patch(`/v2/webhooks/${WEBHOOK_ID}`, (body) => {
        capturedBody = body as Record<string, unknown>;
        return true;
      })
      .reply(200, mockRawWebhook);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await updateWebhook({
      client,
      webhook: WEBHOOK_ID,
      url: "https://example.com/hooks/new",
      authToken: "Bearer new-token",
      headers: { "X-Env": "staging" },
    });

    expect(capturedBody).toEqual({
      url: "https://example.com/hooks/new",
      auth_token: "Bearer new-token",
      headers: { "X-Env": "staging" },
    });
  });

  it("sends a null description to clear it", async () => {
    let capturedBody: Record<string, unknown> = {};
    nock(BASE_URL)
      .patch(`/v2/webhooks/${WEBHOOK_ID}`, (body) => {
        capturedBody = body as Record<string, unknown>;
        return true;
      })
      .reply(200, { ...mockRawWebhook, description: "" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await updateWebhook({
      client,
      webhook: WEBHOOK_ID,
      description: null,
    });

    expect(capturedBody).toEqual({ description: null });
    expect(result.description).toBe("");
  });

  it("throws without calling the API when nothing is provided", async () => {
    const scope = nock(BASE_URL)
      .patch(`/v2/webhooks/${WEBHOOK_ID}`)
      .reply(200, mockRawWebhook);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      updateWebhook({ client, webhook: WEBHOOK_ID }),
    ).rejects.toThrow(/At least one of/);
    expect(scope.isDone()).toBe(false);
  });

  it("resolves a name within an organization before patching", async () => {
    nock(BASE_URL)
      .get("/v2/webhooks")
      .query({ org_id: ORGANIZATION_ID, name: "deploy-notifier", limit: "100" })
      .reply(200, {
        webhooks: [mockRawWebhook],
        pagination: { has_more: false },
      });
    nock(BASE_URL)
      .patch(`/v2/webhooks/${WEBHOOK_ID}`, { name: "renamed" })
      .reply(200, { ...mockRawWebhook, name: "renamed" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await updateWebhook({
      client,
      webhook: "deploy-notifier",
      organization: ORGANIZATION_ID,
      name: "renamed",
    });

    expect(result.name).toBe("renamed");
  });

  it("throws APIError with status 422 on a rejected URL", async () => {
    nock(BASE_URL).patch(`/v2/webhooks/${WEBHOOK_ID}`).reply(422, {
      status: 422,
      title: "Unprocessable Entity",
      detail: "url must use https",
    });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    let thrown: unknown;
    try {
      await updateWebhook({
        client,
        webhook: WEBHOOK_ID,
        url: "http://example.com",
      });
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(APIError);
    expect((thrown as APIError).statusCode).toBe(422);
  });
});
