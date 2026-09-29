import { components } from "../__generated__/api/v2";

export type WebhookAuthType = components["schemas"]["WebhookAuthType"];
export type WebhookEventType = components["schemas"]["WebhookEventType"];
export type WebhookSourceType = components["schemas"]["WebhookSourceType"];

/**
 * An organization-owned destination that receives event deliveries over HTTPS.
 * Credentials are write-only: `authToken` and custom header values are never
 * returned, and the HMAC signing secret is returned once, in the create response.
 */
export interface Webhook {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  url: string;
  /** Fixed at creation. */
  authType: WebhookAuthType;
  /** Redacted hint of the signing secret (e.g. `whsec_…abcd`). `HMAC_SHA256` only. */
  signingSecretHint?: string;
  /** Delivery timeout in milliseconds. */
  timeoutMs: number;
  createdAt: Date;
  updatedAt: Date;
  /** Absent when the creating user has since left the account. */
  createdByUserId?: string;
}

/**
 * The created webhook. `signingSecret` is present only for `HMAC_SHA256`
 * webhooks and only in this response; it cannot be retrieved again.
 */
export type CreatedWebhook = Webhook & {
  signingSecret?: string;
};

/** The outcome of a test delivery to the webhook's endpoint. */
export interface TestWebhookResponse {
  /** HTTP status code from the endpoint. `502` when no response was received. */
  statusCode: number;
  /** Why the test delivery failed. `null` on success. */
  errorMessage: string | null;
}

/** A single attempt to deliver an event to a webhook's endpoint. */
export interface WebhookDeliveryAttempt {
  eventId: string;
  /** Starts at 1. Failed deliveries are retried. */
  attemptNumber: number;
  /** The JSON payload sent to the endpoint. */
  payload: Record<string, unknown>;
  /** `null` when no response was received. */
  statusCode?: number | null;
  /** `null` on success. */
  errorMessage?: string | null;
  createdAt: Date;
}

/** Delivers one event from one prompt or evaluator to one webhook. */
export interface WebhookSubscription {
  id: string;
  webhookId: string;
  sourceType: WebhookSourceType;
  sourceId: string;
  event: WebhookEventType;
  createdAt: Date;
}

export interface CreateWebhookInput {
  /** Organization ID or name to create the webhook in. */
  organization: string;
  /** Unique within the organization, at most 255 characters. */
  name: string;
  /** The HTTPS endpoint events are delivered to. */
  url: string;
  /** Defaults to an empty string. */
  description?: string;
  /** Defaults to `BEARER`. Cannot be changed after creation. */
  authType?: WebhookAuthType;
  /**
   * The complete `Authorization` header value sent verbatim with each
   * delivery, e.g. `"Bearer my-token"`. Only valid when `authType` is
   * `BEARER`. Never returned.
   */
  authToken?: string;
  /** Delivery timeout in milliseconds, 1000 to 60000. Defaults to 30000. */
  timeoutMs?: number;
  /** Custom headers sent with each delivery, at most 20. Values are never returned. */
  headers?: Record<string, string>;
}

/**
 * Fields to change on a webhook. Omitted fields keep their current value.
 * At least one field must be provided.
 */
export interface UpdateWebhookInput {
  name?: string;
  /** Pass `null` to clear the description. */
  description?: string | null;
  url?: string;
  /** Replacement `Authorization` header value. Only valid for `BEARER` webhooks. */
  authToken?: string;
  timeoutMs?: number;
  /** Replaces the whole header map; headers not included are removed. */
  headers?: Record<string, string>;
}

export interface CreateWebhookSubscriptionInput {
  /**
   * Webhook ID or name. Must belong to the source's organization. When a
   * name is given, `organization` is required.
   */
  webhook: string;
  /** Organization ID or name. Required when `webhook` is a name. */
  organization?: string;
  sourceType: WebhookSourceType;
  /** The ID of the prompt or evaluator. */
  sourceId: string;
  /** Must belong to `sourceType`: prompt events for `PROMPT`, evaluator events for `EVALUATOR`. */
  event: WebhookEventType;
}
