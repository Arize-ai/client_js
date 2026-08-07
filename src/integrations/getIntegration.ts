import { createClient } from "../client";
import { Integration, IntegrationType, WithClient } from "../types";
import { handleApiError } from "../errors";
import { findIntegrationId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { transformIntegration } from "./utils";

export type GetIntegrationParams = WithClient<{
  /**
   * The name or ID of the integration to get.
   */
  integration: string;
  /**
   * The integration type (`"LLM"` or `"AGENT"`). Required when `integration`
   * is a name rather than an ID, since names are unique only per (account, type).
   */
  type?: IntegrationType;
  /**
   * The name or ID of the space the integration is visible in. Optional
   * filter used only when resolving `integration` by name.
   */
  space?: string;
}>;

/**
 * Get the information about a specific integration.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param integration - The name or ID of the integration to get.
 * @param type - The integration type (required when using a name for `integration`).
 * @param space - The name or ID of the space (optional filter when using a name).
 * @returns An {@link Integration}.
 * @throws Error if the integration cannot be found, if a name is given
 * without `type`, or if the response is invalid.
 * @example
 * ```typescript
 * import { getIntegration } from "@arizeai/ax-client"
 *
 * // By ID
 * const integration = await getIntegration({ integration: "your_integration_id" });
 *
 * // By name (requires type)
 * const integration = await getIntegration({ integration: "Production OpenAI", type: "LLM" });
 * console.log(integration);
 * ```
 */
export async function getIntegration({
  client: clientInstance,
  integration,
  type,
  space,
}: GetIntegrationParams): Promise<Integration> {
  warnPreRelease({ functionName: "getIntegration", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const integrationId = await findIntegrationId(
    client,
    integration,
    type,
    spaceRef,
  );
  const response = await client.GET("/v2/integrations/{integration_id}", {
    params: {
      path: {
        integration_id: integrationId,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformIntegration(response.data);
}
