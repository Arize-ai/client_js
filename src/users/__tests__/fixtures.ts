import { RawUser, RawCreateUserResponse } from "../../types/internal";

export const mockRawUser: RawUser = {
  id: "VXNlcjoxMjM0NQ==",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  role: { type: "PREDEFINED", name: "MEMBER" },
  created_at: "2024-01-01T12:00:00Z",
  status: "ACTIVE",
  is_developer: false,
};

export const mockRawUserCreated: RawCreateUserResponse = {
  ...mockRawUser,
  invite_mode: "EMAIL_LINK",
  status: "INVITED",
};
