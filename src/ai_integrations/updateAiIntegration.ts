import { createClient } from "../client";
import { AiIntegration, UpdateAiIntegrationInput, WithClient } from "../types";
import { handleApiError } from "../errors";
import { findAiIntegrationId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { toRawScoping, transformAiIntegration } from "./utils";

export type UpdateAiIntegrationParams = WithClient<
  {
    /**
     * The name or ID of the AI integration to update.
     */
    integration: string;
    /**
     * The name or ID of the space the integration belongs to.
     * Required when `integration` is a name rather than an ID.
     */
    space?: string;
  } & UpdateAiIntegrationInput
>;

/**
 * Update an existing AI integration.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param integration - The name or ID of the integration to update.
 * @param space - The name or ID of the space (required when using a name for `integration`).
 * @param name - An optional new name for the integration.
 * @param provider - An optional new provider.
 * @param apiKey - An optional new API key. Pass null to remove the existing key.
 * @param baseUrl - An optional new base URL. Pass null to remove.
 * @param modelNames - An optional new list of model names (replaces all existing).
 * @param headers - An optional new map of custom headers. Pass null to remove.
 * @param enableDefaultModels - Whether to enable the provider's default model list.
 * @param functionCallingEnabled - Whether to enable function/tool calling.
 * @param authType - The authentication method.
 * @param providerMetadata - Optional provider-specific configuration. Pass null to remove.
 * @param scopings - Optional visibility scoping rules (replaces all existing).
 * @returns The updated {@link AiIntegration}.
 * @throws Error if the integration cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateAiIntegration } from "@arizeai/ax-client"
 *
 * // By ID
 * const integration = await updateAiIntegration({
 *   integration: "your_integration_id",
 *   name: "Updated OpenAI",
 *   modelNames: ["gpt-4o"],
 * });
 *
 * // By name (requires space)
 * const integration = await updateAiIntegration({
 *   integration: "Production OpenAI",
 *   space: "my-space",
 *   modelNames: ["gpt-4o"],
 * });
 * console.log(integration);
 * ```
 */
export async function updateAiIntegration({
  client: clientInstance,
  integration,
  space,
  name,
  provider,
  apiKey,
  baseUrl,
  modelNames,
  headers,
  enableDefaultModels,
  functionCallingEnabled,
  authType,
  providerMetadata,
  scopings,
}: UpdateAiIntegrationParams): Promise<AiIntegration> {
  warnPreRelease({ functionName: "updateAiIntegration" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const integrationId = await findAiIntegrationId(
    client,
    integration,
    spaceRef,
  );
  const response = await client.PATCH("/v2/ai-integrations/{integration_id}", {
    params: {
      path: {
        integration_id: integrationId,
      },
    },
    body: {
      name,
      provider,
      api_key: apiKey,
      base_url: baseUrl,
      model_names: modelNames,
      headers,
      enable_default_models: enableDefaultModels,
      function_calling_enabled: functionCallingEnabled,
      auth_type: authType,
      provider_metadata: providerMetadata,
      scopings: scopings?.map(toRawScoping),
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformAiIntegration(response.data);
}
