import { createClient } from "../client";
import {
  PaginatedResponse,
  PaginationParams,
  Span,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
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
    startTime?: Date;
    endTime?: Date;
    filter?: string;
    /**
     * Full dotted column paths to return for each span. Fixed span fields are
     * always returned. Cannot be used with `excludedColumns`.
     */
    includedColumns?: string[];
    /**
     * Full dotted column paths to omit from each span. Fixed span fields are
     * always returned. Cannot be used with `includedColumns`.
     */
    excludedColumns?: string[];
    /**
     * When set, every string value inside each returned span's `attributes`
     * object, including strings nested at any depth in objects and arrays, is
     * shortened to at most this many Unicode code points. Strings longer than
     * the limit are cut and end with a single ellipsis character `…`, which
     * counts toward the limit; strings at or under the limit are unchanged.
     * Only `attributes` string values are affected; span IDs, names, kinds,
     * status, timestamps, annotations, evaluations, events, and pagination are
     * never truncated. Omitted means no truncation. Must be a positive integer;
     * `0` or a negative value is rejected by the server.
     */
    truncateStringLength?: number;
  }
>;

/**
 * List spans for a given project.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param project - The project name or ID to list spans for.
 * @param space - The space name or ID. Required when `project` is a name.
 * @param startTime - An optional Date to filter spans starting at or after this time. Defaults to 1 week ago.
 * @param endTime - An optional Date to filter spans starting before this time. Defaults to the current time.
 * @param filter - An optional filter expression using SQL-like syntax (e.g., `status_code = 'ERROR'`).
 * @param includedColumns - Optional full dotted column paths to return.
 * @param excludedColumns - Optional full dotted column paths to omit.
 * @param truncateStringLength - Optional maximum length for string values in
 *   each span's `attributes` (see {@link ListSpansParams.truncateStringLength}).
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
 *
 * const truncated = await listSpans({
 *   project: "your_project_id",
 *   truncateStringLength: 200,
 * });
 * console.log(truncated);
 * ```
 */
export async function listSpans(
  params: ListSpansParams,
): Promise<PaginatedResponse<Span>> {
  warnPreRelease({ functionName: "listSpans", stage: "beta" });
  const {
    client: clientInstance,
    project,
    space,
    startTime,
    endTime,
    filter,
    includedColumns,
    excludedColumns,
    truncateStringLength,
    limit = DEFAULT_LIST_LIMIT,
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
      ...(startTime !== undefined && { start_time: startTime.toISOString() }),
      ...(endTime !== undefined && { end_time: endTime.toISOString() }),
      ...(filter !== undefined && { filter }),
      ...(includedColumns !== undefined && {
        included_columns: includedColumns,
      }),
      ...(excludedColumns !== undefined && {
        excluded_columns: excludedColumns,
      }),
      ...(truncateStringLength !== undefined && {
        truncate_string_length: truncateStringLength,
      }),
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
