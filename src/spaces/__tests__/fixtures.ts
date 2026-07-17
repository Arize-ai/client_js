import { RawSpace, RawSpaceMembership } from "../../types/internal";

const mockDateString = "2021-01-01T00:00:00.000Z";
const mockSpaceId = "test-space-id";
const mockSpaceName = "test-space";
const mockDescription = "A test space";

export const mockSpace: RawSpace = {
  id: mockSpaceId,
  name: mockSpaceName,
  description: mockDescription,
  created_at: mockDateString,
};

export const mockRawSpaceMembership: RawSpaceMembership = {
  id: "spm_001",
  user_id: "VXNlcjoxMjM0NQ==",
  space_id: "U3BhY2U6YWJjMTIz",
  role: { type: "PREDEFINED", name: "MEMBER" },
};
