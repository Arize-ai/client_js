import { createClient } from "../client";
import {
  AuditLog,
  AuditLogOperationType,
  PaginatedResponse,
  PaginationParams,
  WithClient,
} from "../types";
import {
  DEFAULT_LIST_LIMIT,
  transformPaginationMetadata,
} from "../utils/pagination";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformAuditLog } from "./utils";

export type ListAuditLogsParams = WithClient<
  PaginationParams & {
    /**
     * Optional inclusive lower bound on `created_at` (ISO 8601 datetime or
     * Date object). When omitted, the server defaults to 30 days before
     * `endTime`.
     */
    startTime?: Date | string;
    /**
     * Optional inclusive upper bound on `created_at` (ISO 8601 datetime or
     * Date object). When omitted, the server defaults to the current time.
     */
    endTime?: Date | string;
    /**
     * Optional base64-encoded user ID. When provided, filters results to
     * entries for that user.
     */
    userId?: string;
    /** Optional filter by operation type. */
    operationType?: AuditLogOperationType;
  }
>;

/**
 * List audit log entries for the account, ordered newest first.
 *
 * The caller must be an account admin and the account must have audit
 * logging enabled. Returns a 403 if neither condition is met.
 *
 * @param startTime - Optional inclusive lower bound on `created_at`. Accepts
 *   an ISO 8601 string or a Date object.
 * @param endTime - Optional inclusive upper bound on `created_at`. Accepts
 *   an ISO 8601 string or a Date object.
 * @param userId - Optional base64-encoded user ID to filter results.
 * @param operationType - Optional operation type filter (`"QUERY"`,
 *   `"MUTATION"`, or `"SUBSCRIPTION"`).
 * @param limit - Maximum number of results to return (1-100).
 * @param cursor - Pagination cursor from a previous response.
 * @returns A paginated list of {@link AuditLog} objects.
 * @throws Error if the request fails (e.g. 403 if not an account admin).
 * @example
 * ```typescript
 * import { listAuditLogs } from "@arizeai/ax-client"
 *
 * const { data } = await listAuditLogs({ operationType: "MUTATION" });
 * console.log(data);
 * ```
 */
export async function listAuditLogs(
  params: ListAuditLogsParams = {},
): Promise<PaginatedResponse<AuditLog>> {
  warnPreRelease({ functionName: "listAuditLogs", stage: "beta" });
  const {
    client: clientInstance,
    startTime,
    endTime,
    userId,
    operationType,
    limit = DEFAULT_LIST_LIMIT,
    cursor,
  } = params;
  const client = clientInstance ?? createClient();
  const response = await client.GET("/v2/audit-logs", {
    params: {
      query: {
        start_time:
          startTime instanceof Date ? startTime.toISOString() : startTime,
        end_time: endTime instanceof Date ? endTime.toISOString() : endTime,
        user_id: userId,
        operation_type: operationType,
        limit,
        cursor,
      },
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return {
    data: response.data.logs.map(transformAuditLog),
    pagination: transformPaginationMetadata(response.data.pagination),
  };
}
