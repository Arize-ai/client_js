import { RawUser, RawUserCreatedResponse } from "../../types/internal";

export const mockRawUser: RawUser = {
  id: "VXNlcjoxMjM0NQ==",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  role: { type: "predefined", name: "member" },
  created_at: "2024-01-01T12:00:00Z",
  status: "active",
  is_developer: false,
};

export const mockRawUserCreated: RawUserCreatedResponse = {
  ...mockRawUser,
  invite_mode: "email_link",
  status: "invited",
};
