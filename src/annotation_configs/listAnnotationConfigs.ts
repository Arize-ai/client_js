import { createClient } from "../client";
import {
  AnnotationConfig,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { transformAnnotationConfig } from "./utils";

export type ListAnnotationConfigsParams = WithClient<
  PaginationParams & {
    spaceId?: string;
  }
>;

/**
 * List the information about all annotation configs available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param spaceId - An optional base64 encoded space ID used to filter annotation configs in a specific space.
 * @param limit - An optional limit on the number of annotation configs to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link AnnotationConfig} objects.
 * @throws Error if the annotation configs cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listAnnotationConfigs } from "@arizeai/ax-client"
 *
 * const annotationConfigs = await listAnnotationConfigs();
 * console.log(annotationConfigs);
 * ```
 */
export async function listAnnotationConfigs(
  params: ListAnnotationConfigsParams = {},
): Promise<PaginatedResponse<AnnotationConfig>> {
  warnPreRelease({ functionName: "listAnnotationConfigs" });
  const { client: clientInstance, spaceId, limit, cursor } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/annotation-configs", {
    params: {
      query: {
        space_id: spaceId,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return {
    data: response.data.annotation_configs.map(transformAnnotationConfig),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
