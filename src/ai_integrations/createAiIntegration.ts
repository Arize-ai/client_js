import { createClient } from "../client";
import { AiIntegration, CreateAiIntegrationInput, WithClient } from "../types";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { toRawScoping, transformAiIntegration } from "./utils";

export type CreateAiIntegrationParams = WithClient<CreateAiIntegrationInput>;

/**
 * Create a new AI integration.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the integration.
 * @param provider - The AI provider (e.g. "OPEN_AI", "ANTHROPIC", "AWS_BEDROCK").
 * @param apiKey - An optional API key for the provider.
 * @param baseUrl - An optional custom base URL for the provider.
 * @param modelNames - An optional list of supported model names.
 * @param headers - An optional map of custom headers to include in requests.
 * @param enableDefaultModels - Whether to enable the provider's default model list.
 * @param functionCallingEnabled - Whether to enable function/tool calling.
 * @param authType - The authentication method ("DEFAULT" or "PROXY_WITH_HEADERS").
 * @param providerMetadata - Optional provider-specific configuration.
 * @param scopings - Optional visibility scoping rules. Defaults to account-wide.
 * @returns A created {@link AiIntegration}.
 * @throws Error if the integration cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createAiIntegration } from "@arizeai/ax-client"
 *
 * const integration = await createAiIntegration({
 *   name: "Production OpenAI",
 *   provider: "OPEN_AI",
 *   apiKey: "sk-...",
 *   modelNames: ["gpt-4o", "gpt-4o-mini"],
 *   enableDefaultModels: true,
 * });
 * console.log(integration);
 * ```
 */
export async function createAiIntegration({
  client: clientInstance,
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
}: CreateAiIntegrationParams): Promise<AiIntegration> {
  warnPreRelease({ functionName: "createAiIntegration", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const response = await client.POST("/v2/ai-integrations", {
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
