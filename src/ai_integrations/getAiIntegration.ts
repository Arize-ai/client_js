import { createClient } from "../client";
import { AiIntegration, WithClient } from "../types";
import { handleApiError } from "../errors";
import { findAiIntegrationId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformAiIntegration } from "./utils";

export type GetAiIntegrationParams = WithClient<{
  /**
   * The name or ID of the AI integration to get.
   */
  integration: string;
  /**
   * The name or ID of the space the integration belongs to.
   * Required when `integration` is a name rather than an ID.
   */
  space?: string;
}>;

/**
 * Get the information about a specific AI integration.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param integration - The name or ID of the AI integration to get.
 * @param space - The name or ID of the space (required when using a name for `integration`).
 * @returns An {@link AiIntegration}.
 * @throws Error if the integration cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getAiIntegration } from "@arizeai/ax-client"
 *
 * // By ID
 * const integration = await getAiIntegration({ integration: "your_integration_id" });
 *
 * // By name (requires space)
 * const integration = await getAiIntegration({ integration: "Production OpenAI", space: "my-space" });
 * console.log(integration);
 * ```
 */
export async function getAiIntegration({
  client: clientInstance,
  integration,
  space,
}: GetAiIntegrationParams): Promise<AiIntegration> {
  warnPreRelease({ functionName: "getAiIntegration", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const integrationId = await findAiIntegrationId(
    client,
    integration,
    spaceRef,
  );
  const response = await client.GET("/v2/ai-integrations/{integration_id}", {
    params: {
      path: {
        integration_id: integrationId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformAiIntegration(response.data);
}
