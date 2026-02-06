import { PaginationMetadata } from "../types";
import { RawPaginationMetadata } from "../types/internal";

export function transformPaginationMetadata(
  paginationMetadata: RawPaginationMetadata,
): PaginationMetadata {
  return {
    nextCursor: paginationMetadata.next_cursor,
    hasMore: paginationMetadata.has_more,
  };
}
