import { createClient } from "../client";
import {
  AiIntegration,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { resolveSpace } from "../utils/space";
import { transformAiIntegration } from "./utils";

export type ListAiIntegrationsParams = WithClient<
  PaginationParams & {
    /**
     * Optional space filter. If the value starts with `"spc_"` it is treated
     * as a space ID; otherwise it is used as a case-insensitive substring
     * filter on the space name.
     */
    space?: string;
    /** Case-insensitive substring filter on the integration name. */
    name?: string;
  }
>;

/**
 * List AI integrations available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - An optional space filter. Pass a space ID (e.g. `"spc_abc123"`) or a space name for substring filtering.
 * @param name - An optional case-insensitive substring filter on the integration name.
 * @param limit - An optional limit on the number of integrations to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link AiIntegration} objects.
 * @throws Error if the integrations cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listAiIntegrations } from "@arizeai/ax-client"
 *
 * const integrations = await listAiIntegrations({ space: "my-space" });
 * console.log(integrations);
 * ```
 */
export async function listAiIntegrations(
  params: ListAiIntegrationsParams = {},
): Promise<PaginatedResponse<AiIntegration>> {
  warnPreRelease({ functionName: "listAiIntegrations", stage: "alpha" });
  const { client: clientInstance, space, name, limit, cursor } = params;
  const { spaceId, spaceName } = resolveSpace(space);
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/ai-integrations", {
    params: {
      query: {
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
    data: response.data.ai_integrations.map(transformAiIntegration),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
