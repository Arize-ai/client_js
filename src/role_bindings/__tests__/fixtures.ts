import { RawRoleBinding } from "../../types/internal";

const mockCreatedAt = "2021-01-01T00:00:00.000Z";
const mockUpdatedAt = "2021-01-02T00:00:00.000Z";

export const mockRoleBinding: RawRoleBinding = {
  id: "test-binding-id",
  role_id: "test-role-id",
  user_id: "test-user-id",
  resource_type: "PROJECT",
  resource_id: "test-project-id",
  created_at: mockCreatedAt,
  updated_at: mockUpdatedAt,
};
