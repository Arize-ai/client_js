import { createClient } from "../client";
import {
  AnnotationConfig,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { resolveSpace } from "../utils/space";
import { transformAnnotationConfig } from "./utils";

export type ListAnnotationConfigsParams = WithClient<
  PaginationParams & {
    /**
     * Optional space filter. If the value is a base64-encoded resource ID
     * (e.g. `"U3BhY2U6YWJjMTIz"`) it is treated as a space ID; otherwise it
     * is used as a case-insensitive substring filter on the space name.
     */
    space?: string;
    /** Case-insensitive substring filter on the annotation config name. */
    name?: string;
  }
>;

/**
 * List the information about all annotation configs available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - An optional space filter. Pass a base64-encoded space ID (e.g. `"U3BhY2U6YWJjMTIz"`) or a space name for substring filtering.
 * @param name - An optional case-insensitive substring filter on the annotation config name.
 * @param limit - An optional limit on the number of annotation configs to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link AnnotationConfig} objects.
 * @throws Error if the annotation configs cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listAnnotationConfigs } from "@arizeai/ax-client"
 *
 * const annotationConfigs = await listAnnotationConfigs({ space: "my-space" });
 * console.log(annotationConfigs);
 * ```
 */
export async function listAnnotationConfigs(
  params: ListAnnotationConfigsParams = {},
): Promise<PaginatedResponse<AnnotationConfig>> {
  warnPreRelease({ functionName: "listAnnotationConfigs" });
  const { client: clientInstance, space, name, limit, cursor } = params;
  const { spaceId, spaceName } = resolveSpace(space);
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/annotation-configs", {
    params: {
      query: {
        space_id: spaceId,
        space_name: spaceName,
        name,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.annotation_configs.map(transformAnnotationConfig),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
