import { createClient } from "../client";
import {
  CreateWebhookSubscriptionInput,
  WebhookSubscription,
  WithClient,
} from "../types";
import { handleApiError } from "../errors";
import { findWebhookId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformWebhookSubscription } from "./utils";

export type CreateWebhookSubscriptionParams =
  WithClient<CreateWebhookSubscriptionInput>;

/**
 * Subscribe a webhook to one event on a prompt or evaluator. To deliver
 * several events to the same webhook, create one subscription per event.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param webhook - The webhook ID or name. Must belong to the source's organization.
 * @param organization - An optional organization ID or name. Required when `webhook` is a name.
 * @param sourceType - `PROMPT` or `EVALUATOR`.
 * @param sourceId - The ID of the prompt or evaluator.
 * @param event - The event to deliver. Must belong to `sourceType`.
 * @returns The created {@link WebhookSubscription}.
 * @throws Error if the subscription cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createWebhookSubscription } from "@arizeai/ax-client"
 *
 * const subscription = await createWebhookSubscription({
 *   webhook: "deploy-notifier",
 *   organization: "my-org",
 *   sourceType: "PROMPT",
 *   sourceId: "your_prompt_id",
 *   event: "PROMPT_VERSION_CREATED",
 * });
 * console.log(subscription.id);
 * ```
 */
export async function createWebhookSubscription({
  client: clientInstance,
  webhook,
  organization,
  sourceType,
  sourceId,
  event,
}: CreateWebhookSubscriptionParams): Promise<WebhookSubscription> {
  warnPreRelease({ functionName: "createWebhookSubscription", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const webhookId = await findWebhookId(client, webhook, organization);
  const response = await client.POST("/v2/webhook-subscriptions", {
    body: {
      webhook_id: webhookId,
      source_type: sourceType,
      source_id: sourceId,
      event,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformWebhookSubscription(response.data);
}
