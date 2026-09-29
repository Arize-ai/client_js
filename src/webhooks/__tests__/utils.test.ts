import { describe, expect, it } from "vitest";
import {
  buildUpdateWebhookBody,
  transformCreateWebhookResponse,
  transformTestWebhookResponse,
  transformWebhook,
  transformWebhookDeliveryAttempt,
  transformWebhookSubscription,
} from "../utils";
import {
  mockRawCreateWebhookResponse,
  mockRawDeliveryAttempt,
  mockRawHmacWebhook,
  mockRawSubscription,
  mockRawTestWebhookResponse,
  mockRawWebhook,
} from "./fixtures";

describe("transformWebhook", () => {
  it("maps snake_case fields to camelCase and parses timestamps", () => {
    expect(transformWebhook(mockRawWebhook)).toEqual({
      id: mockRawWebhook.id,
      organizationId: mockRawWebhook.organization_id,
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
  });

  it("keeps the signing secret hint and an absent creator", () => {
    const result = transformWebhook(mockRawHmacWebhook);
    expect(result.authType).toBe("HMAC_SHA256");
    expect(result.signingSecretHint).toBe("whsec_…abcd");
    expect(result.createdByUserId).toBeUndefined();
  });

  it("never exposes credentials", () => {
    const result = transformWebhook(mockRawWebhook);
    expect(result).not.toHaveProperty("authToken");
    expect(result).not.toHaveProperty("headers");
    expect(result).not.toHaveProperty("signingSecret");
  });
});

describe("transformCreateWebhookResponse", () => {
  it("maps signing_secret to signingSecret alongside the webhook fields", () => {
    const result = transformCreateWebhookResponse(mockRawCreateWebhookResponse);
    expect(result).toEqual({
      ...transformWebhook(mockRawHmacWebhook),
      signingSecret: "whsec_supersecretvalueabcd",
    });
  });

  it("leaves signingSecret undefined for BEARER webhooks", () => {
    const result = transformCreateWebhookResponse(mockRawWebhook);
    expect(result.signingSecret).toBeUndefined();
  });
});

describe("transformTestWebhookResponse", () => {
  it("maps status_code and error_message", () => {
    expect(transformTestWebhookResponse(mockRawTestWebhookResponse)).toEqual({
      statusCode: 502,
      errorMessage: "connection refused",
    });
  });

  it("keeps a null error message", () => {
    expect(
      transformTestWebhookResponse({ status_code: 200, error_message: null }),
    ).toEqual({ statusCode: 200, errorMessage: null });
  });
});

describe("transformWebhookDeliveryAttempt", () => {
  it("maps snake_case fields and parses created_at", () => {
    expect(transformWebhookDeliveryAttempt(mockRawDeliveryAttempt)).toEqual({
      eventId: "evt_001",
      attemptNumber: 2,
      payload: mockRawDeliveryAttempt.payload,
      statusCode: null,
      errorMessage: "timed out",
      createdAt: new Date(mockRawDeliveryAttempt.created_at),
    });
  });

  it("leaves statusCode and errorMessage undefined when absent", () => {
    const result = transformWebhookDeliveryAttempt({
      event_id: "evt_002",
      attempt_number: 1,
      payload: {},
      created_at: mockRawDeliveryAttempt.created_at,
    });
    expect(result.statusCode).toBeUndefined();
    expect(result.errorMessage).toBeUndefined();
  });
});

describe("transformWebhookSubscription", () => {
  it("maps snake_case fields and parses created_at", () => {
    expect(transformWebhookSubscription(mockRawSubscription)).toEqual({
      id: mockRawSubscription.id,
      webhookId: mockRawSubscription.webhook_id,
      sourceType: "PROMPT",
      sourceId: mockRawSubscription.source_id,
      event: "PROMPT_VERSION_CREATED",
      createdAt: new Date(mockRawSubscription.created_at),
    });
  });
});

describe("buildUpdateWebhookBody", () => {
  it("includes only the provided fields, under their wire names", () => {
    expect(
      buildUpdateWebhookBody({ name: "renamed", timeoutMs: 5000 }),
    ).toEqual({ name: "renamed", timeout_ms: 5000 });
  });

  it("maps every field", () => {
    expect(
      buildUpdateWebhookBody({
        name: "n",
        description: "d",
        url: "https://example.com/new",
        authToken: "Bearer tok",
        timeoutMs: 1000,
        headers: { "X-Env": "prod" },
      }),
    ).toEqual({
      name: "n",
      description: "d",
      url: "https://example.com/new",
      auth_token: "Bearer tok",
      timeout_ms: 1000,
      headers: { "X-Env": "prod" },
    });
  });

  it("sends a null description so the server clears it", () => {
    expect(buildUpdateWebhookBody({ description: null })).toEqual({
      description: null,
    });
  });

  it("sends an empty headers map so the server removes all custom headers", () => {
    expect(buildUpdateWebhookBody({ headers: {} })).toEqual({ headers: {} });
  });

  it("throws when nothing is provided", () => {
    expect(() => buildUpdateWebhookBody({})).toThrow(
      /At least one of name, description, url, authToken, timeoutMs, or headers/,
    );
  });

  it("treats explicit undefined as not provided", () => {
    expect(() =>
      buildUpdateWebhookBody({ name: undefined, url: undefined }),
    ).toThrow();
  });
});
