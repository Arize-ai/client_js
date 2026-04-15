import { RawResourceRestriction } from "../../types/internal";

const mockCreatedAt = "2021-01-01T00:00:00.000Z";
const mockResourceId = "TW9kZWw6MTIxOmFCY0Q=";

export const mockResourceRestriction: RawResourceRestriction = {
  resource_type: "PROJECT",
  resource_id: mockResourceId,
  created_at: mockCreatedAt,
};
