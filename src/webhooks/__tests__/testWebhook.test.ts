import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { APIError, BadRequestError } from "../../errors";
import { testWebhook } from "../testWebhook";
import {
  BASE_URL,
  ORGANIZATION_ID,
  WEBHOOK_ID,
  mockRawTestWebhookResponse,
  mockRawWebhook,
} from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("testWebhook", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("POSTs /v2/webhooks/{webhook_id}/test with no body and maps the outcome", async () => {
    const checkWarning = captureAlphaWarning("testWebhook");
    let capturedBody: unknown = "unset";
    nock(BASE_URL)
      .post(`/v2/webhooks/${WEBHOOK_ID}/test`, (body) => {
        capturedBody = body;
        return true;
      })
      .reply(200, mockRawTestWebhookResponse);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await testWebhook({ client, webhook: WEBHOOK_ID });

    expect(capturedBody).toEqual("");
    expect(result).toEqual({
      statusCode: 502,
      errorMessage: "connection refused",
    });
    checkWarning();
  });

  it("returns a null errorMessage for a successful delivery", async () => {
    nock(BASE_URL)
      .post(`/v2/webhooks/${WEBHOOK_ID}/test`)
      .reply(200, { status_code: 200, error_message: null });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await testWebhook({ client, webhook: WEBHOOK_ID });

    expect(result).toEqual({ statusCode: 200, errorMessage: null });
  });

  it("resolves a name within an organization before testing", async () => {
    nock(BASE_URL)
      .get("/v2/webhooks")
      .query({ org_id: ORGANIZATION_ID, name: "deploy-notifier", limit: "100" })
      .reply(200, {
        webhooks: [mockRawWebhook],
        pagination: { has_more: false },
      });
    nock(BASE_URL)
      .post(`/v2/webhooks/${WEBHOOK_ID}/test`)
      .reply(200, { status_code: 200, error_message: null });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await testWebhook({
      client,
      webhook: "deploy-notifier",
      organization: ORGANIZATION_ID,
    });

    expect(result.statusCode).toBe(200);
  });

  it("throws BadRequestError when the webhook uses HMAC_SHA256", async () => {
    nock(BASE_URL).post(`/v2/webhooks/${WEBHOOK_ID}/test`).reply(400, {
      status: 400,
      title: "Bad Request",
      detail: "Test deliveries are not supported for HMAC_SHA256 webhooks",
    });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      testWebhook({ client, webhook: WEBHOOK_ID }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("throws APIError with status 503 when the test could not be sent", async () => {
    nock(BASE_URL)
      .post(`/v2/webhooks/${WEBHOOK_ID}/test`)
      .reply(503, { status: 503, title: "Service Unavailable" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    let thrown: unknown;
    try {
      await testWebhook({ client, webhook: WEBHOOK_ID });
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(APIError);
    expect((thrown as APIError).statusCode).toBe(503);
  });
});
