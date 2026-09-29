import { createClient } from "../client";
import { Integration, UpdateIntegrationInput, WithClient } from "../types";
import { handleApiError } from "../errors";
import { findIntegrationId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { toRawUpdateIntegration, transformIntegration } from "./utils";

export type UpdateIntegrationParams = WithClient<
  {
    /**
     * The name or ID of the integration to update.
     */
    integration: string;
    /**
     * The name or ID of the space the integration is visible in. Optional
     * filter used only when resolving `integration` by name.
     */
    space?: string;
  } & UpdateIntegrationInput
>;

/**
 * Update an existing integration. `type` is required (it selects the update
 * shape) and is immutable server-side. Provide at least one updatable field.
 * Collection fields (`scopings`, agent `requestPresets`) replace on provide.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param integration - The name or ID of the integration to update.
 * @param type - The integration type (`"LLM"`, `"AGENT"`, or `"EVALUATOR"`). Immutable.
 * @param space - The name or ID of the space (optional filter when using a name).
 * @param name - An optional new name for the integration.
 * @param scopings - Optional replacement visibility scoping rules.
 * @param description - An optional new description (AGENT and EVALUATOR integrations only).
 * @param config - Optional type-specific configuration changes.
 * @returns The updated {@link Integration}.
 * @throws Error if no updatable field is provided, or if the integration
 * cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateIntegration } from "@arizeai/ax-client"
 *
 * // Rotate an LLM integration's API key by name (provider selects the config
 * // variant; it is immutable and must match the stored value)
 * const integration = await updateIntegration({
 *   integration: "Production OpenAI",
 *   type: "LLM",
 *   config: { provider: "OPEN_AI", apiKey: "sk-new-key" },
 * });
 * console.log(integration);
 * ```
 */
export async function updateIntegration(
  params: UpdateIntegrationParams,
): Promise<Integration> {
  warnPreRelease({ functionName: "updateIntegration", stage: "alpha" });

  // The server rejects type-only PATCHes; reject empty updates locally so
  // callers get a clear error instead of an opaque 4xx.
  const hasUpdateFields =
    params.name !== undefined ||
    params.scopings !== undefined ||
    params.config !== undefined ||
    ((params.type === "AGENT" || params.type === "EVALUATOR") &&
      params.description !== undefined);
  if (!hasUpdateFields) {
    throw new Error(
      params.type === "LLM"
        ? "At least one update field must be provided (name, scopings, or config)."
        : "At least one update field must be provided (name, description, scopings, or config).",
    );
  }

  const { client: clientInstance, integration, space } = params;
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const integrationId = await findIntegrationId(
    client,
    integration,
    params.type,
    spaceRef,
  );
  const response = await client.PATCH("/v2/integrations/{integration_id}", {
    params: {
      path: {
        integration_id: integrationId,
      },
    },
    body: toRawUpdateIntegration(params),
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformIntegration(response.data);
}
