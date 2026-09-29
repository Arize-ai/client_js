import { createClient } from "../client";
import { WithClient } from "../types";
import { handleApiError } from "../errors";
import { findWebhookId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";

export type DeleteWebhookParams = WithClient<{
  /** The webhook ID or name. When a name is given, `organization` is required. */
  webhook: string;
  /** Organization ID or name. Required when `webhook` is a name. */
  organization?: string;
}>;

/**
 * Delete a webhook by ID or name. The webhook stops receiving events and is
 * detached from every prompt, evaluator, and monitor it was subscribed to.
 * Delivery history is kept.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param webhook - The webhook ID or name.
 * @param organization - An optional organization ID or name. Required when `webhook` is a name.
 * @returns void.
 * @throws Error if the webhook cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteWebhook } from "@arizeai/ax-client"
 *
 * await deleteWebhook({ webhook: "deploy-notifier", organization: "my-org" });
 * ```
 */
export async function deleteWebhook({
  client: clientInstance,
  webhook,
  organization,
}: DeleteWebhookParams): Promise<void> {
  warnPreRelease({ functionName: "deleteWebhook", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const webhookId = await findWebhookId(client, webhook, organization);
  const response = await client.DELETE("/v2/webhooks/{webhook_id}", {
    params: {
      path: {
        webhook_id: webhookId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
