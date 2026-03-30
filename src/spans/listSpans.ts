import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  Span,
  WithClient,
} from "../types";
import { transformPaginationMetadata } from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { findProjectId, toSpaceRef } from "../utils/resolve";
import { transformSpan } from "./utils";

export type ListSpansParams = WithClient<
  PaginationParams & {
    /**
     * The project name or ID to list spans for.
     */
    project: string;
    /**
     * The space name or ID. Required when `project` is a name.
     */
    space?: string;
    startTime?: string;
    endTime?: string;
    filter?: string;
  }
>;

/**
 * List spans for a given project.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param project - The project name or ID to list spans for.
 * @param space - The space name or ID. Required when `project` is a name.
 * @param startTime - An optional ISO 8601 timestamp to filter spans starting at or after this time. Defaults to 1 week ago.
 * @param endTime - An optional ISO 8601 timestamp to filter spans starting before this time. Defaults to the current time.
 * @param filter - An optional filter expression using SQL-like syntax (e.g., `status_code = 'ERROR'`).
 * @param limit - An optional limit on the number of spans to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link Span} objects.
 * @throws Error if the spans cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listSpans } from "@arizeai/ax-client"
 *
 * // By project ID
 * const spans = await listSpans({ project: "your_project_id" });
 *
 * // By project name (requires space)
 * const spans = await listSpans({ project: "My Project", space: "my-space" });
 * console.log(spans);
 * ```
 */
export async function listSpans(
  params: ListSpansParams,
): Promise<PaginatedResponse<Span>> {
  warnPreRelease({ functionName: "listSpans" });
  const {
    client: clientInstance,
    project,
    space,
    startTime,
    endTime,
    filter,
    limit,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const projectId = await findProjectId(client, project, spaceRef);
  const response = await client.POST("/v2/spans", {
    params: {
      query: {
        limit,
        cursor,
      },
    },
    body: {
      project_id: projectId,
      start_time: startTime,
      end_time: endTime,
      filter,
    },
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return {
    data: response.data.spans.map(transformSpan),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
