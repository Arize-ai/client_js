import { createClient } from "../client";
import { WithClient } from "../types";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";

export type DeleteWebhookSubscriptionParams = WithClient<{
  /** The subscription ID. */
  subscriptionId: string;
}>;

/**
 * Delete a webhook subscription by ID. The webhook stops receiving that event
 * from the source; other subscriptions and the webhook itself are unchanged.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param subscriptionId - The subscription ID.
 * @returns void.
 * @throws Error if the subscription cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteWebhookSubscription } from "@arizeai/ax-client"
 *
 * await deleteWebhookSubscription({ subscriptionId: "your_subscription_id" });
 * ```
 */
export async function deleteWebhookSubscription({
  client: clientInstance,
  subscriptionId,
}: DeleteWebhookSubscriptionParams): Promise<void> {
  warnPreRelease({ functionName: "deleteWebhookSubscription", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE(
    "/v2/webhook-subscriptions/{subscription_id}",
    {
      params: {
        path: {
          subscription_id: subscriptionId,
        },
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
}
