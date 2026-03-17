import { createClient } from "../client";
import { AiIntegration, WithClient } from "../types";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { transformAiIntegration } from "./utils";

export type GetAiIntegrationParams = WithClient<{
  /**
   * The ID of the AI integration to get.
   */
  integrationId: string;
}>;

/**
 * Get the information about a specific AI integration.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param integrationId - The ID of the AI integration to get.
 * @returns An {@link AiIntegration}.
 * @throws Error if the integration cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getAiIntegration } from "@arizeai/ax-client"
 *
 * const integration = await getAiIntegration({ integrationId: "your_integration_id" });
 * console.log(integration);
 * ```
 */
export async function getAiIntegration({
  client: clientInstance,
  integrationId,
}: GetAiIntegrationParams): Promise<AiIntegration> {
  warnPreRelease({ functionName: "getAiIntegration" });
  const client = clientInstance ?? createClient();
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
