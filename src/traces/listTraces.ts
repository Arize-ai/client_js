import { createClient } from "../client";
import { handleApiError } from "../errors";
import {
  PaginatedResponse,
  PaginationParams,
  Trace,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { findProjectId, toSpaceRef } from "../utils/resolve";
import { transformTrace } from "./utils";

export type ListTracesParams = WithClient<
  PaginationParams & {
    /**
     * The project name or ID to list traces for.
     */
    project: string;
    /**
     * The space name or ID. Required when `project` is a name.
     */
    space?: string;
    startTime?: Date;
    endTime?: Date;
    filter?: string;
  }
>;

/**
 * List traces for a given project.
 *
 * Each trace carries its full (flat) list of spans plus lightweight roll-up
 * metadata. The optional `filter` uses the same SQL-like expression syntax as
 * `listSpans`, but the semantics are trace-contains-match: a trace is returned
 * when **any** of its spans matches the filter (the matching span is usually a
 * child, not the root).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param project - The project name or ID to list traces for.
 * @param space - The space name or ID. Required when `project` is a name.
 * @param startTime - An optional Date to filter traces whose spans start at or after this time. Defaults to 1 week ago.
 * @param endTime - An optional Date to filter traces whose spans start before this time. Defaults to the current time.
 * @param filter - An optional filter expression using SQL-like syntax (e.g., `status_code = 'ERROR'`).
 * @param limit - An optional limit on the number of traces to return.
 * @param cursor - An optional cursor for pagination.
 * @returns A paginated list of {@link Trace} objects, each carrying its flat list of {@link Span} objects.
 * @throws Error if the traces cannot be listed or the response is invalid.
 * @example
 * ```typescript
 * import { listTraces } from "@arizeai/ax-client"
 *
 * // By project ID
 * const traces = await listTraces({ project: "your_project_id" });
 *
 * // By project name (requires space)
 * const byName = await listTraces({ project: "My Project", space: "my-space" });
 * console.log(traces);
 * ```
 */
export async function listTraces(
  params: ListTracesParams,
): Promise<PaginatedResponse<Trace>> {
  warnPreRelease({ functionName: "listTraces", stage: "beta" });
  const {
    client: clientInstance,
    project,
    space,
    startTime,
    endTime,
    filter,
    limit = DEFAULT_LIST_LIMIT,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const projectId = await findProjectId(client, project, spaceRef);
  const response = await client.POST("/v2/traces", {
    params: {
      query: {
        limit,
        cursor,
      },
    },
    body: {
      project_id: projectId,
      start_time: startTime?.toISOString(),
      end_time: endTime?.toISOString(),
      filter,
    },
  });
  if (response.error) {
    handleApiError({ error: response.error });
  }
  return {
    data: response.data.traces.map(transformTrace),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
