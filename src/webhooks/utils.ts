import {
  CreatedWebhook,
  TestWebhookResponse,
  UpdateWebhookInput,
  Webhook,
  WebhookDeliveryAttempt,
  WebhookSubscription,
} from "../types";
import {
  RawCreateWebhookResponse,
  RawTestWebhookResponse,
  RawUpdateWebhookRequest,
  RawWebhook,
  RawWebhookDeliveryAttempt,
  RawWebhookSubscription,
} from "../types/internal";

export function transformWebhook(raw: RawWebhook): Webhook {
  return {
    id: raw.id,
    organizationId: raw.organization_id,
    name: raw.name,
    description: raw.description,
    url: raw.url,
    authType: raw.auth_type,
    signingSecretHint: raw.signing_secret_hint,
    timeoutMs: raw.timeout_ms,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
    createdByUserId: raw.created_by_user_id,
  };
}

export function transformCreateWebhookResponse(
  raw: RawCreateWebhookResponse,
): CreatedWebhook {
  return {
    ...transformWebhook(raw),
    signingSecret: raw.signing_secret,
  };
}

export function transformTestWebhookResponse(
  raw: RawTestWebhookResponse,
): TestWebhookResponse {
  return {
    statusCode: raw.status_code,
    errorMessage: raw.error_message,
  };
}

export function transformWebhookDeliveryAttempt(
  raw: RawWebhookDeliveryAttempt,
): WebhookDeliveryAttempt {
  return {
    eventId: raw.event_id,
    attemptNumber: raw.attempt_number,
    payload: raw.payload,
    statusCode: raw.status_code,
    errorMessage: raw.error_message,
    createdAt: new Date(raw.created_at),
  };
}

export function transformWebhookSubscription(
  raw: RawWebhookSubscription,
): WebhookSubscription {
  return {
    id: raw.id,
    webhookId: raw.webhook_id,
    sourceType: raw.source_type,
    sourceId: raw.source_id,
    event: raw.event,
    createdAt: new Date(raw.created_at),
  };
}

/**
 * Build the PATCH body for a webhook update. Only keys the caller provided are
 * present, so the server keeps every omitted field.
 *
 * @throws Error when no field is provided.
 */
export function buildUpdateWebhookBody({
  name,
  description,
  url,
  authToken,
  timeoutMs,
  headers,
}: UpdateWebhookInput): RawUpdateWebhookRequest {
  const body: RawUpdateWebhookRequest = {};
  if (name !== undefined) {
    body.name = name;
  }
  if (description !== undefined) {
    body.description = description;
  }
  if (url !== undefined) {
    body.url = url;
  }
  if (authToken !== undefined) {
    body.auth_token = authToken;
  }
  if (timeoutMs !== undefined) {
    body.timeout_ms = timeoutMs;
  }
  if (headers !== undefined) {
    body.headers = headers;
  }
  if (Object.keys(body).length === 0) {
    throw new Error(
      "At least one of name, description, url, authToken, timeoutMs, or headers must be provided.",
    );
  }
  return body;
}
