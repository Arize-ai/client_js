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
import { transformAiIntegration } from "./utils";

export type ListAiIntegrationsParams = WithClient<
  PaginationParams & {
    spaceId?: string;
  }
>;

/**
 * List AI integrations available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - An optional space ID used to filter integrations in a specific space.
 * @param limit - An optional limit on the number of integrations to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link AiIntegration} objects.
 * @throws Error if the integrations cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listAiIntegrations } from "@arizeai/ax-client"
 *
 * const integrations = await listAiIntegrations();
 * console.log(integrations);
 * ```
 */
export async function listAiIntegrations(
  params: ListAiIntegrationsParams = {},
): Promise<PaginatedResponse<AiIntegration>> {
  warnPreRelease({ functionName: "listAiIntegrations" });
  const { client: clientInstance, spaceId, limit, cursor } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/ai-integrations", {
    params: {
      query: {
        space_id: spaceId,
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
