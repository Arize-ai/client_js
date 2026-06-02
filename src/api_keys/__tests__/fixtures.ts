import { RawApiKey, RawApiKeyCreated } from "../../types/internal";

export const mockRawApiKey: RawApiKey = {
  id: "key-id-123",
  name: "ci-key",
  description: "CI pipeline key",
  key_type: "user",
  status: "active",
  redacted_key: "ak-abc...xyz",
  created_at: "2026-01-01T00:00:00.000Z",
  expires_at: "2027-01-01T00:00:00.000Z",
  created_by_user_id: "user-123",
};

export const mockRawApiKeyCreated: RawApiKeyCreated = {
  ...mockRawApiKey,
  key: "ak-full-secret-value",
};
