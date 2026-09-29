import { createClient } from "../client";
import { Webhook, WithClient } from "../types";
import { handleApiError } from "../errors";
import { findWebhookId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformWebhook } from "./utils";

export type GetWebhookParams = WithClient<{
  /** The webhook ID or name. When a name is given, `organization` is required. */
  webhook: string;
  /** Organization ID or name. Required when `webhook` is a name. */
  organization?: string;
}>;

/**
 * Get a webhook by ID or name. Credentials are never included.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param webhook - The webhook ID or name.
 * @param organization - An optional organization ID or name. Required when `webhook` is a name.
 * @returns A {@link Webhook}.
 * @throws Error if the webhook cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getWebhook } from "@arizeai/ax-client"
 *
 * const webhook = await getWebhook({ webhook: "deploy-notifier", organization: "my-org" });
 * console.log(webhook);
 * ```
 */
export async function getWebhook({
  client: clientInstance,
  webhook,
  organization,
}: GetWebhookParams): Promise<Webhook> {
  warnPreRelease({ functionName: "getWebhook", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const webhookId = await findWebhookId(client, webhook, organization);
  const response = await client.GET("/v2/webhooks/{webhook_id}", {
    params: {
      path: {
        webhook_id: webhookId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformWebhook(response.data);
}
