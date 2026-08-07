import { createClient } from "../client";
import {
  Integration,
  IntegrationType,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { resolveSpace } from "../utils/space";
import { transformIntegration } from "./utils";

export type ListIntegrationsParams = WithClient<
  PaginationParams & {
    /**
     * The integration type to list. Optional — when set, the response
     * contains only integrations of this type; when omitted, integrations of
     * every type are returned, each carrying its `type` discriminator.
     */
    type?: IntegrationType;
    /**
     * Optional space filter. If the value is a base64-encoded resource ID it
     * is treated as a space ID; otherwise it is used as a case-insensitive
     * substring filter on the space name.
     */
    space?: string;
    /** Case-insensitive substring filter on the integration name. */
    name?: string;
  }
>;

/**
 * List integrations available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param type - An optional integration type filter (`"LLM"` or `"AGENT"`). Omit to list integrations of every type.
 * @param space - An optional space filter. Pass a base64 space ID or a space name for substring filtering.
 * @param name - An optional case-insensitive substring filter on the integration name.
 * @param limit - An optional limit on the number of integrations to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link Integration} objects.
 * @throws Error if the integrations cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listIntegrations } from "@arizeai/ax-client"
 *
 * // Only agent integrations
 * const agents = await listIntegrations({ type: "AGENT", space: "my-space" });
 *
 * // Every type, discriminated by `integration.type`
 * const all = await listIntegrations({});
 * ```
 */
export async function listIntegrations(
  params: ListIntegrationsParams,
): Promise<PaginatedResponse<Integration>> {
  warnPreRelease({ functionName: "listIntegrations", stage: "alpha" });
  const {
    client: clientInstance,
    type,
    space,
    name,
    limit = DEFAULT_LIST_LIMIT,
    cursor,
  } = params;
  const { spaceId, spaceName } = resolveSpace(space);
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/integrations", {
    params: {
      query: {
        type,
        space_id: spaceId,
        space_name: spaceName,
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
    data: response.data.integrations.map(transformIntegration),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
