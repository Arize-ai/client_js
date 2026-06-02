import { PaginationMetadata } from "../types";
import { RawPaginationMetadata } from "../types/internal";

/**
 * Default page size the SDK applies when a `list*` call omits `limit`.
 * Centralized here so every list operation shares one source of truth; change
 * it in one place to change the default everywhere.
 */
export const DEFAULT_LIST_LIMIT = 50;

export function transformPaginationMetadata(
  paginationMetadata: RawPaginationMetadata,
): PaginationMetadata {
  return {
    nextCursor: paginationMetadata.next_cursor,
    hasMore: paginationMetadata.has_more,
  };
}
