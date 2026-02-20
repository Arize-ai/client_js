import { createClient } from "../client";
import { WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";

export type DeleteAnnotationConfigParams = WithClient<{
  annotationConfigId: string;
}>;

/**
 * Delete an annotation config by its ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationConfigId - The ID of the annotation config to delete.
 * @returns void.
 * @throws Error if the annotation config cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteAnnotationConfig } from "@arizeai/ax-client"
 *
 * await deleteAnnotationConfig({
 *   annotationConfigId: "your_annotation_config_id",
 * });
 * ```
 */
export async function deleteAnnotationConfig({
  client: clientInstance,
  annotationConfigId,
}: DeleteAnnotationConfigParams): Promise<void> {
  warnPreRelease({ functionName: "deleteAnnotationConfig" });
  const client = clientInstance ?? createClient();
  const response = await client.DELETE(
    "/v2/annotation-configs/{annotation_config_id}",
    {
      params: {
        path: {
          annotation_config_id: annotationConfigId,
        },
      },
    },
  );
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
}
