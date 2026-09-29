import { createClient } from "../client";
import { WebhookSubscription, WithClient } from "../types";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { transformWebhookSubscription } from "./utils";

export type GetWebhookSubscriptionParams = WithClient<{
  /** The subscription ID. */
  subscriptionId: string;
}>;

/**
 * Get a webhook subscription by ID. A 404 is returned when the subscription
 * does not exist, its source is not readable, or its webhook has been deleted.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param subscriptionId - The subscription ID.
 * @returns A {@link WebhookSubscription}.
 * @throws Error if the subscription cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getWebhookSubscription } from "@arizeai/ax-client"
 *
 * const subscription = await getWebhookSubscription({ subscriptionId: "your_subscription_id" });
 * console.log(subscription);
 * ```
 */
export async function getWebhookSubscription({
  client: clientInstance,
  subscriptionId,
}: GetWebhookSubscriptionParams): Promise<WebhookSubscription> {
  warnPreRelease({ functionName: "getWebhookSubscription", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.GET(
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
  return transformWebhookSubscription(response.data);
}
