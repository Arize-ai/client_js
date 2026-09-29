import {
  RawCreateWebhookResponse,
  RawTestWebhookResponse,
  RawWebhook,
  RawWebhookDeliveryAttempt,
  RawWebhookSubscription,
} from "../../types/internal";

export const BASE_URL = "http://localhost";

// Base64 resource IDs, so the resolvers return them without a lookup. The
// decoded lengths are multiples of 3, so the encodings carry no `=` padding
// and match nock paths without percent-encoding.
export const WEBHOOK_ID = btoa("Webhook:1:ab");
export const ORGANIZATION_ID = btoa("Organization:1:abc");
export const SUBSCRIPTION_ID = btoa("WebhookSubscription:1:ab");
export const PROMPT_ID = btoa("Prompt:1:abc");

const mockDateString = "2021-01-01T00:00:00.000Z";

export const mockRawWebhook: RawWebhook = {
  id: WEBHOOK_ID,
  organization_id: ORGANIZATION_ID,
  name: "deploy-notifier",
  description: "Posts prompt changes to the deploy channel",
  url: "https://example.com/hooks/arize",
  auth_type: "BEARER",
  timeout_ms: 30000,
  created_at: mockDateString,
  updated_at: mockDateString,
  created_by_user_id: btoa("User:1:ab"),
};

export const mockRawHmacWebhook: RawWebhook = {
  ...mockRawWebhook,
  id: btoa("Webhook:2:ab"),
  name: "signed-notifier",
  auth_type: "HMAC_SHA256",
  signing_secret_hint: "whsec_…abcd",
  created_by_user_id: undefined,
};

export const mockRawCreateWebhookResponse: RawCreateWebhookResponse = {
  ...mockRawHmacWebhook,
  signing_secret: "whsec_supersecretvalueabcd",
};

export const mockRawTestWebhookResponse: RawTestWebhookResponse = {
  status_code: 502,
  error_message: "connection refused",
};

export const mockRawDeliveryAttempt: RawWebhookDeliveryAttempt = {
  event_id: "evt_001",
  attempt_number: 2,
  payload: { event: "PROMPT_VERSION_CREATED", prompt_id: PROMPT_ID },
  status_code: null,
  error_message: "timed out",
  created_at: mockDateString,
};

export const mockRawSubscription: RawWebhookSubscription = {
  id: SUBSCRIPTION_ID,
  webhook_id: WEBHOOK_ID,
  source_type: "PROMPT",
  source_id: PROMPT_ID,
  event: "PROMPT_VERSION_CREATED",
  created_at: mockDateString,
};
