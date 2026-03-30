import { RawPermission, RawRole } from "../../types/internal";

const mockCreatedAt = "2021-01-01T00:00:00.000Z";
const mockUpdatedAt = "2021-01-02T00:00:00.000Z";
const mockRoleId = "test-role-id";
const mockRoleName = "AI Engineer";
const mockDescription = "Can read and create datasets and experiments.";
const mockPermissions: RawPermission[] = [
  "PROJECT_READ",
  "DATASET_READ",
  "DATASET_CREATE",
];

export const mockRole: RawRole = {
  id: mockRoleId,
  name: mockRoleName,
  description: mockDescription,
  permissions: mockPermissions,
  is_predefined: false,
  created_at: mockCreatedAt,
  updated_at: mockUpdatedAt,
};
