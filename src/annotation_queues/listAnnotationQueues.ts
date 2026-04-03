import { createClient } from "../client";
import {
  AnnotationQueue,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformAnnotationQueue } from "./utils";
import { resolveSpace } from "../utils/space";

export type ListAnnotationQueuesParams = WithClient<
  PaginationParams & {
    /**
     * Optional space filter. If the value is a base64-encoded resource ID it is
     * treated as a space ID; otherwise it is used as a case-insensitive substring
     * filter on the space name.
     */
    space?: string;
    /** Case-insensitive substring filter on the annotation queue name. */
    name?: string;
  }
>;

/**
 * List the information about all annotation queues available to the client.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param space - An optional space filter. Pass a space ID or a space name for substring filtering.
 * @param name - An optional case-insensitive substring filter on the annotation queue name.
 * @param limit - An optional limit on the number of annotation queues to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A list of {@link AnnotationQueue} objects.
 * @throws Error if the annotation queues cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listAnnotationQueues } from "@arizeai/ax-client"
 *
 * const annotationQueues = await listAnnotationQueues({ space: "my_space" });
 * console.log(annotationQueues);
 * ```
 */
export async function listAnnotationQueues(
  params: ListAnnotationQueuesParams = {},
): Promise<PaginatedResponse<AnnotationQueue>> {
  warnPreRelease({ functionName: "listAnnotationQueues" });
  const { client: clientInstance, space, name, limit, cursor } = params;
  const { spaceId, spaceName } = resolveSpace(space);
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/annotation-queues", {
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
    data: response.data.annotation_queues.map(transformAnnotationQueue),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
