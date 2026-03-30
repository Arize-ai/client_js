import { createClient } from "../client";
import { WithClient } from "../types/client";
import { handleApiError } from "../errors";
import { findAiIntegrationId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";

export type DeleteAiIntegrationParams = WithClient<{
  /**
   * The name or ID of the AI integration to delete.
   */
  integration: string;
  /**
   * The name or ID of the space the integration belongs to.
   * Required when `integration` is a name rather than an ID.
   */
  space?: string;
}>;

/**
 * Delete an AI integration by its name or ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param integration - The name or ID of the AI integration to delete.
 * @param space - The name or ID of the space (required when using a name for `integration`).
 * @returns void.
 * @throws Error if the integration cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteAiIntegration } from "@arizeai/ax-client"
 *
 * // By ID
 * await deleteAiIntegration({
 *   integration: "your_integration_id",
 * });
 *
 * // By name (requires space)
 * await deleteAiIntegration({
 *   integration: "Production OpenAI",
 *   space: "my-space",
 * });
 * ```
 */
export async function deleteAiIntegration({
  client: clientInstance,
  integration,
  space,
}: DeleteAiIntegrationParams): Promise<void> {
  warnPreRelease({ functionName: "deleteAiIntegration" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const integrationId = await findAiIntegrationId(
    client,
    integration,
    spaceRef,
  );
  const response = await client.DELETE("/v2/ai-integrations/{integration_id}", {
    params: {
      path: { integration_id: integrationId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
