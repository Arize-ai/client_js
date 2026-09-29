import { createClient } from "../client";
import { UpdateWebhookInput, Webhook, WithClient } from "../types";
import { handleApiError } from "../errors";
import { findWebhookId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { buildUpdateWebhookBody, transformWebhook } from "./utils";

export type UpdateWebhookParams = WithClient<
  {
    /** The webhook ID or name. When a name is given, `organization` is required. */
    webhook: string;
    /** Organization ID or name. Required when `webhook` is a name. */
    organization?: string;
  } & UpdateWebhookInput
>;

/**
 * Update a webhook. Omitted fields keep their current value; at least one
 * field must be provided. `authType` cannot be changed, and the signing
 * secret of an `HMAC_SHA256` webhook cannot be rotated.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param webhook - The webhook ID or name.
 * @param organization - An optional organization ID or name. Required when `webhook` is a name.
 * @param name - A new name. Must stay unique within the organization.
 * @param description - A new description. Pass `null` to clear it.
 * @param url - A new HTTPS endpoint.
 * @param authToken - A replacement `Authorization` header value. `BEARER` webhooks only.
 * @param timeoutMs - A new delivery timeout in milliseconds, 1000 to 60000.
 * @param headers - Replacement custom headers. Replaces the whole map.
 * @returns The updated {@link Webhook}.
 * @throws Error if no field is provided, the webhook cannot be updated, or the response is invalid.
 * @example
 * ```typescript
 * import { updateWebhook } from "@arizeai/ax-client"
 *
 * const webhook = await updateWebhook({
 *   webhook: "deploy-notifier",
 *   organization: "my-org",
 *   timeoutMs: 10000,
 * });
 * console.log(webhook.timeoutMs);
 * ```
 */
export async function updateWebhook({
  client: clientInstance,
  webhook,
  organization,
  name,
  description,
  url,
  authToken,
  timeoutMs,
  headers,
}: UpdateWebhookParams): Promise<Webhook> {
  warnPreRelease({ functionName: "updateWebhook", stage: "alpha" });
  const body = buildUpdateWebhookBody({
    name,
    description,
    url,
    authToken,
    timeoutMs,
    headers,
  });
  const client = clientInstance ?? createClient();
  const webhookId = await findWebhookId(client, webhook, organization);
  const response = await client.PATCH("/v2/webhooks/{webhook_id}", {
    params: {
      path: {
        webhook_id: webhookId,
      },
    },
    body,
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformWebhook(response.data);
}
