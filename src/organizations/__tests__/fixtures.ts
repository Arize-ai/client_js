import { RawOrganization } from "../../types/internal";

const mockDateString = "2021-01-01T00:00:00.000Z";
const mockOrgId = "test-org-id";
const mockOrgName = "test-organization";
const mockDescription = "A test organization";

export const mockOrganization: RawOrganization = {
  id: mockOrgId,
  name: mockOrgName,
  description: mockDescription,
  created_at: mockDateString,
};
