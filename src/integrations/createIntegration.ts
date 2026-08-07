import { createClient } from "../client";
import { CreateIntegrationInput, Integration, WithClient } from "../types";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";
import { toRawCreateIntegration, transformIntegration } from "./utils";

export type CreateIntegrationParams = WithClient<CreateIntegrationInput>;

/**
 * Create a new integration. The `type` field selects the config shape:
 * - `"LLM"` — a model-provider integration (e.g. OpenAI, Anthropic).
 * - `"AGENT"` — a customer-hosted HTTPS endpoint plus a request JSON Schema.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param type - The integration type (`"LLM"` or `"AGENT"`).
 * @param name - The integration name (unique per account and type).
 * @param scopings - Optional visibility scoping rules. Defaults to account-wide.
 * @param description - Optional description (AGENT integrations only).
 * @param config - The type-specific configuration.
 * @returns A created {@link Integration}.
 * @throws Error if the integration cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createIntegration } from "@arizeai/ax-client"
 *
 * // LLM integration
 * const llm = await createIntegration({
 *   type: "LLM",
 *   name: "Production OpenAI",
 *   config: { provider: "OPEN_AI", apiKey: "sk-..." },
 * });
 *
 * // Agent integration
 * const agent = await createIntegration({
 *   type: "AGENT",
 *   name: "My Support Agent",
 *   config: {
 *     endpoint: "https://agent.example.com/replay",
 *     inputSchema: { type: "object", properties: { input: { type: "string" } } },
 *     requestPresets: [{ name: "default", config: { input: "hello" } }],
 *   },
 * });
 * console.log(llm, agent);
 * ```
 */
export async function createIntegration(
  params: CreateIntegrationParams,
): Promise<Integration> {
  warnPreRelease({ functionName: "createIntegration", stage: "alpha" });
  const client = params.client ?? createClient();
  const response = await client.POST("/v2/integrations", {
    body: toRawCreateIntegration(params),
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformIntegration(response.data);
}
