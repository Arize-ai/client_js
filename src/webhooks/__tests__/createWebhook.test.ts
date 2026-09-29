import { afterEach, beforeEach, describe, expect, it } from "vitest";
import nock from "nock";
import { createClient } from "../../client";
import { APIError, AuthorizationError } from "../../errors";
import { createWebhook } from "../createWebhook";
import {
  BASE_URL,
  ORGANIZATION_ID,
  mockRawCreateWebhookResponse,
  mockRawWebhook,
} from "./fixtures";
import { captureAlphaWarning } from "./helpers";

describe("createWebhook", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("POSTs snake_case fields and maps signing_secret to signingSecret", async () => {
    const checkWarning = captureAlphaWarning("createWebhook");
    let capturedBody: Record<string, unknown> = {};
    nock(BASE_URL)
      .post("/v2/webhooks", (body) => {
        capturedBody = body as Record<string, unknown>;
        return true;
      })
      .reply(201, mockRawCreateWebhookResponse);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await createWebhook({
      client,
      organization: ORGANIZATION_ID,
      name: "signed-notifier",
      url: "https://example.com/hooks/arize",
      description: "Signed deliveries",
      authType: "HMAC_SHA256",
      timeoutMs: 5000,
      headers: { "X-Env": "prod" },
    });

    expect(capturedBody).toEqual({
      organization_id: ORGANIZATION_ID,
      name: "signed-notifier",
      url: "https://example.com/hooks/arize",
      description: "Signed deliveries",
      auth_type: "HMAC_SHA256",
      timeout_ms: 5000,
      headers: { "X-Env": "prod" },
    });
    expect(result.signingSecret).toBe(
      mockRawCreateWebhookResponse.signing_secret,
    );
    expect(result.signingSecretHint).toBe("whsec_…abcd");
    expect(result.authType).toBe("HMAC_SHA256");
    expect(result.organizationId).toBe(ORGANIZATION_ID);
    expect(result.createdAt).toEqual(
      new Date(mockRawCreateWebhookResponse.created_at),
    );
    expect(result).not.toHaveProperty("signing_secret");
    checkWarning();
  });

  it("sends auth_token for BEARER webhooks and omits unset optional fields", async () => {
    let capturedBody: Record<string, unknown> = {};
    nock(BASE_URL)
      .post("/v2/webhooks", (body) => {
        capturedBody = body as Record<string, unknown>;
        return true;
      })
      .reply(201, mockRawWebhook);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await createWebhook({
      client,
      organization: ORGANIZATION_ID,
      name: "deploy-notifier",
      url: "https://example.com/hooks/arize",
      authToken: "Bearer my-token",
    });

    expect(capturedBody).toEqual({
      organization_id: ORGANIZATION_ID,
      name: "deploy-notifier",
      url: "https://example.com/hooks/arize",
      auth_token: "Bearer my-token",
    });
    expect(result.signingSecret).toBeUndefined();
    expect(result).not.toHaveProperty("authToken");
  });

  it("resolves an organization name before creating", async () => {
    nock(BASE_URL)
      .get("/v2/organizations")
      .query({ name: "my-org", limit: "100" })
      .reply(200, {
        organizations: [{ id: ORGANIZATION_ID, name: "my-org" }],
        pagination: { has_more: false },
      });
    nock(BASE_URL)
      .post(
        "/v2/webhooks",
        (body) =>
          (body as Record<string, unknown>).organization_id === ORGANIZATION_ID,
      )
      .reply(201, mockRawWebhook);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    const result = await createWebhook({
      client,
      organization: "my-org",
      name: "deploy-notifier",
      url: "https://example.com/hooks/arize",
    });

    expect(result.id).toBe(mockRawWebhook.id);
  });

  it("throws APIError with status 409 on a duplicate name", async () => {
    nock(BASE_URL).post("/v2/webhooks").reply(409, {
      status: 409,
      title: "Conflict",
      detail: "A webhook with this name already exists",
    });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    let thrown: unknown;
    try {
      await createWebhook({
        client,
        organization: ORGANIZATION_ID,
        name: "deploy-notifier",
        url: "https://example.com/hooks/arize",
      });
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(APIError);
    expect((thrown as APIError).statusCode).toBe(409);
  });

  it("throws AuthorizationError on 403", async () => {
    nock(BASE_URL)
      .post("/v2/webhooks")
      .reply(403, { status: 403, title: "Forbidden" });

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      createWebhook({
        client,
        organization: ORGANIZATION_ID,
        name: "deploy-notifier",
        url: "https://example.com/hooks/arize",
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("throws on an empty organization without calling the API", async () => {
    const scope = nock(BASE_URL).post("/v2/webhooks").reply(500);

    const client = createClient({ apiKey: "test-key", baseUrl: BASE_URL });
    await expect(
      createWebhook({
        client,
        organization: "",
        name: "deploy-notifier",
        url: "https://example.com/hooks/arize",
      }),
    ).rejects.toThrow("organization is required");
    expect(scope.isDone()).toBe(false);
  });
});
