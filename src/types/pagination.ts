import { components } from "../__generated__/api/v2";

export type PaginationMetadata = {
  nextCursor?: string;
  hasMore: boolean;
};

export interface PaginationParams {
  limit?: number;
  cursor?: components["parameters"]["CursorQueryParam"];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}
