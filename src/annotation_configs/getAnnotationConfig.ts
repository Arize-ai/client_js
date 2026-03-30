import { createClient } from "../client";
import { AnnotationConfig, WithClient } from "../types";
import { findAnnotationConfigId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformAnnotationConfig } from "./utils";

export type GetAnnotationConfigParams = WithClient<{
  annotationConfig: string;
  space?: string;
}>;

/**
 * Get the information about a specific annotation config.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationConfig - The name or ID of the annotation config to get.
 * @param space - The space name or ID. Required when `annotationConfig` is a name.
 * @returns An {@link AnnotationConfig}.
 * @throws Error if the annotation config cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getAnnotationConfig } from "@arizeai/ax-client"
 *
 * const annotationConfig = await getAnnotationConfig({
 *   annotationConfig: "Accuracy",
 *   space: "your_space",
 * });
 * console.log(annotationConfig);
 * ```
 */
export async function getAnnotationConfig({
  client: clientInstance,
  annotationConfig,
  space,
}: GetAnnotationConfigParams): Promise<AnnotationConfig> {
  warnPreRelease({ functionName: "getAnnotationConfig" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationConfigId = await findAnnotationConfigId(
    client,
    annotationConfig,
    spaceRef,
  );
  const response = await client.GET(
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
  return transformAnnotationConfig(response.data);
}
