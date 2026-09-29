import { createClient } from "../client";
import { CreatedWebhook, CreateWebhookInput, WithClient } from "../types";
import { handleApiError } from "../errors";
import { findOrganizationId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformCreateWebhookResponse } from "./utils";

export type CreateWebhookParams = WithClient<CreateWebhookInput>;

/**
 * Create a webhook.
 *
 * For `HMAC_SHA256` webhooks the result carries `signingSecret`. This is the
 * only time the secret is returned; store it securely. Afterwards only the
 * redacted `signingSecretHint` is readable, and losing the secret means
 * deleting and recreating the webhook.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param organization - The organization ID or name to create the webhook in.
 * @param name - The webhook name. Must be unique within the organization.
 * @param url - The HTTPS endpoint events are delivered to.
 * @param description - An optional description.
 * @param authType - `BEARER` (default) or `HMAC_SHA256`. Cannot be changed after creation.
 * @param authToken - The complete `Authorization` header value sent with each
 * delivery, e.g. `"Bearer my-token"`. Only valid when `authType` is `BEARER`.
 * @param timeoutMs - Delivery timeout in milliseconds, 1000 to 60000. Defaults to 30000.
 * @param headers - Custom headers sent with each delivery, at most 20.
 * @returns The {@link CreatedWebhook}, with `signingSecret` for `HMAC_SHA256` webhooks.
 * @throws Error if the webhook cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createWebhook } from "@arizeai/ax-client"
 *
 * const webhook = await createWebhook({
 *   organization: "my-org",
 *   name: "deploy-notifier",
 *   url: "https://example.com/hooks/arize",
 *   authToken: "Bearer my-token",
 * });
 * console.log(webhook.id);
 * ```
 */
export async function createWebhook({
  client: clientInstance,
  organization,
  name,
  url,
  description,
  authType,
  authToken,
  timeoutMs,
  headers,
}: CreateWebhookParams): Promise<CreatedWebhook> {
  warnPreRelease({ functionName: "createWebhook", stage: "alpha" });
  if (!organization) {
    throw new Error("organization is required");
  }
  const client = clientInstance ?? createClient();
  const orgId = await findOrganizationId(client, organization);
  const response = await client.POST("/v2/webhooks", {
    body: {
      organization_id: orgId,
      name,
      url,
      description,
      auth_type: authType,
      auth_token: authToken,
      timeout_ms: timeoutMs,
      headers,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformCreateWebhookResponse(response.data);
}
