import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  WebhookSourceType,
  WebhookSubscription,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { transformWebhookSubscription } from "./utils";

export type ListWebhookSubscriptionsParams = WithClient<
  PaginationParams & {
    /** Restrict to one source kind. Must be given together with `sourceId`. */
    sourceType?: WebhookSourceType;
    /** Restrict to one prompt or evaluator ID. Must be given together with `sourceType`. */
    sourceId?: string;
  }
>;

/**
 * List webhook subscriptions on prompts and evaluators, most recently created
 * first. Each subscription delivers one event to one webhook.
 *
 * Subscriptions whose webhook has since been deleted are dropped after the
 * page is read, so a page may hold fewer than `limit` items while
 * `pagination.hasMore` is still true. Keep paging until it is false.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param sourceType - An optional source kind. Requires `sourceId`.
 * @param sourceId - An optional prompt or evaluator ID. Requires `sourceType`.
 * @param limit - An optional limit on the number of subscriptions to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link WebhookSubscription} objects.
 * @throws Error if only one of `sourceType` and `sourceId` is given, the
 * subscriptions cannot be listed, or the response is invalid.
 * @example
 * ```typescript
 * import { listWebhookSubscriptions } from "@arizeai/ax-client"
 *
 * const subscriptions = await listWebhookSubscriptions({
 *   sourceType: "PROMPT",
 *   sourceId: "your_prompt_id",
 * });
 * console.log(subscriptions.data);
 * ```
 */
export async function listWebhookSubscriptions(
  params: ListWebhookSubscriptionsParams = {},
): Promise<PaginatedResponse<WebhookSubscription>> {
  warnPreRelease({ functionName: "listWebhookSubscriptions", stage: "alpha" });
  const {
    client: clientInstance,
    sourceType,
    sourceId,
    limit = DEFAULT_LIST_LIMIT,
    cursor,
  } = params;
  if ((sourceType === undefined) !== (sourceId === undefined)) {
    throw new Error("sourceType and sourceId must be provided together.");
  }
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/webhook-subscriptions", {
    params: {
      query: {
        source_type: sourceType,
        source_id: sourceId,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.subscriptions.map(transformWebhookSubscription),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
