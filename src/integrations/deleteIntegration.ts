import { createClient } from "../client";
import { IntegrationType, WithClient } from "../types";
import { handleApiError } from "../errors";
import { findIntegrationId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";

export type DeleteIntegrationParams = WithClient<{
  /**
   * The name or ID of the integration to delete.
   */
  integration: string;
  /**
   * The integration type (`"LLM"` or `"AGENT"`). Required when `integration`
   * is a name rather than an ID.
   */
  type?: IntegrationType;
  /**
   * The name or ID of the space the integration is visible in. Optional
   * filter used only when resolving `integration` by name.
   */
  space?: string;
}>;

/**
 * Delete an integration by its name or ID. This operation is irreversible.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param integration - The name or ID of the integration to delete.
 * @param type - The integration type (required when using a name for `integration`).
 * @param space - The name or ID of the space (optional filter when using a name).
 * @returns void.
 * @throws Error if the integration cannot be deleted, if a name is given
 * without `type`, or if the response is invalid.
 * @example
 * ```typescript
 * import { deleteIntegration } from "@arizeai/ax-client"
 *
 * // By ID
 * await deleteIntegration({ integration: "your_integration_id" });
 *
 * // By name (requires type)
 * await deleteIntegration({ integration: "Production OpenAI", type: "LLM" });
 * ```
 */
export async function deleteIntegration({
  client: clientInstance,
  integration,
  type,
  space,
}: DeleteIntegrationParams): Promise<void> {
  warnPreRelease({ functionName: "deleteIntegration", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const integrationId = await findIntegrationId(
    client,
    integration,
    type,
    spaceRef,
  );
  const response = await client.DELETE("/v2/integrations/{integration_id}", {
    params: {
      path: { integration_id: integrationId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
