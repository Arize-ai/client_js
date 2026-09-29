import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  Webhook,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { handleApiError } from "../errors";
import { findOrganizationId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformWebhook } from "./utils";

export type ListWebhooksParams = WithClient<
  PaginationParams & {
    /**
     * Optional organization ID or name. Omit or pass an empty string to list
     * webhooks across every organization the caller can read.
     */
    organization?: string;
    /** Case-insensitive substring filter on the webhook name. */
    name?: string;
  }
>;

/**
 * List webhooks, most recently created first. Webhooks used as monitor
 * notification channels are included.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param organization - An optional organization ID or name to narrow the list.
 * @param name - An optional case-insensitive substring filter on the webhook name.
 * @param limit - An optional limit on the number of webhooks to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link Webhook} objects.
 * @throws Error if the webhooks cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listWebhooks } from "@arizeai/ax-client"
 *
 * const webhooks = await listWebhooks({ organization: "my-org" });
 * console.log(webhooks.data);
 * ```
 */
export async function listWebhooks(
  params: ListWebhooksParams = {},
): Promise<PaginatedResponse<Webhook>> {
  warnPreRelease({ functionName: "listWebhooks", stage: "alpha" });
  const {
    client: clientInstance,
    organization,
    name,
    limit = DEFAULT_LIST_LIMIT,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  const orgId = organization
    ? await findOrganizationId(client, organization)
    : undefined;
  const response = await client.GET("/v2/webhooks", {
    params: {
      query: {
        org_id: orgId,
        name,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.webhooks.map(transformWebhook),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
