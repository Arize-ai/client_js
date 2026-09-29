import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  WebhookDeliveryAttempt,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { handleApiError } from "../errors";
import { findWebhookId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformWebhookDeliveryAttempt } from "./utils";

export type ListWebhookDeliveryAttemptsParams = WithClient<
  PaginationParams & {
    /** The webhook ID or name. When a name is given, `organization` is required. */
    webhook: string;
    /** Organization ID or name. Required when `webhook` is a name. */
    organization?: string;
  }
>;

/**
 * List a webhook's delivery attempts, most recent first. Each event may have
 * several attempts, since failed deliveries are retried.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param webhook - The webhook ID or name.
 * @param organization - An optional organization ID or name. Required when `webhook` is a name.
 * @param limit - An optional limit on the number of attempts to return, up to 500.
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link WebhookDeliveryAttempt} objects.
 * @throws Error if the attempts cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listWebhookDeliveryAttempts } from "@arizeai/ax-client"
 *
 * const attempts = await listWebhookDeliveryAttempts({
 *   webhook: "deploy-notifier",
 *   organization: "my-org",
 * });
 * console.log(attempts.data);
 * ```
 */
export async function listWebhookDeliveryAttempts({
  client: clientInstance,
  webhook,
  organization,
  limit = DEFAULT_LIST_LIMIT,
  cursor,
}: ListWebhookDeliveryAttemptsParams): Promise<
  PaginatedResponse<WebhookDeliveryAttempt>
> {
  warnPreRelease({
    functionName: "listWebhookDeliveryAttempts",
    stage: "alpha",
  });
  const client = clientInstance ?? createClient();
  const webhookId = await findWebhookId(client, webhook, organization);
  const response = await client.GET(
    "/v2/webhooks/{webhook_id}/delivery-attempts",
    {
      params: {
        path: {
          webhook_id: webhookId,
        },
        query: {
          limit,
          cursor,
        },
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.delivery_attempts.map(transformWebhookDeliveryAttempt),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
