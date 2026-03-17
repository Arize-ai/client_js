import { createClient } from "../client";
import { WithClient } from "../types/client";
import { handleApiError } from "../errors";
import { warnPreRelease } from "../utils/warning";

export type DeleteAiIntegrationParams = WithClient<{
  integrationId: string;
}>;

/**
 * Delete an AI integration by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param integrationId - The ID of the AI integration to delete.
 * @returns void.
 * @throws Error if the integration cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteAiIntegration } from "@arizeai/ax-client"
 *
 * await deleteAiIntegration({
 *   integrationId: "your_integration_id",
 * });
 * ```
 */
export async function deleteAiIntegration({
  client: clientInstance,
  integrationId,
}: DeleteAiIntegrationParams): Promise<void> {
  warnPreRelease({ functionName: "deleteAiIntegration" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE("/v2/ai-integrations/{integration_id}", {
    params: {
      path: { integration_id: integrationId },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
}
