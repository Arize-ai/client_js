import { createClient } from "../client";
import { WithClient } from "../types";
import { findAnnotationConfigId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";

export type DeleteAnnotationConfigParams = WithClient<{
  annotationConfig: string;
  space?: string;
}>;

/**
 * Delete an annotation config by its name or ID.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationConfig - The name or ID of the annotation config to delete.
 * @param space - The space name or ID. Required when `annotationConfig` is a name.
 * @returns void.
 * @throws Error if the annotation config cannot be deleted or the response is invalid.
 * @example
 * ```typescript
 * import { deleteAnnotationConfig } from "@arizeai/ax-client"
 *
 * await deleteAnnotationConfig({
 *   annotationConfig: "Accuracy",
 *   space: "your_space",
 * });
 * ```
 */
export async function deleteAnnotationConfig({
  client: clientInstance,
  annotationConfig,
  space,
}: DeleteAnnotationConfigParams): Promise<void> {
  warnPreRelease({ functionName: "deleteAnnotationConfig", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationConfigId = await findAnnotationConfigId(
    client,
    annotationConfig,
    spaceRef,
  );
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
    return handleApiError(response);
  }
}
