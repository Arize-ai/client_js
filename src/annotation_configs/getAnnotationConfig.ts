import { createClient } from "../client";
import { AnnotationConfig, WithClient } from "../types";
import { warnPreRelease } from "../utils/warning";
import { transformAnnotationConfig } from "./utils";

export type GetAnnotationConfigParams = WithClient<{
  annotationConfigId: string;
}>;

/**
 * Get the information about a specific annotation config.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationConfigId - The ID of the annotation config to get.
 * @returns An {@link AnnotationConfig}.
 * @throws Error if the annotation config cannot be found or the response is invalid.
 * @example
 * ```typescript
 * import { getAnnotationConfig } from "@arizeai/ax-client"
 *
 * const annotationConfig = await getAnnotationConfig({ annotationConfigId: "your_annotation_config_id" });
 * console.log(annotationConfig);
 * ```
 */
export async function getAnnotationConfig({
  client: clientInstance,
  annotationConfigId,
}: GetAnnotationConfigParams): Promise<AnnotationConfig> {
  warnPreRelease({ functionName: "getAnnotationConfig" });
  const client = clientInstance ?? createClient();
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
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformAnnotationConfig(response.data);
}
