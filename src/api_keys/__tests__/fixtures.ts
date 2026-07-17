import { RawApiKey, RawApiKeyRedacted } from "../../types/internal";

export const mockRawApiKeyRedacted: RawApiKeyRedacted = {
  id: "key-id-123",
  name: "ci-key",
  description: "CI pipeline key",
  key_type: "USER",
  status: "ACTIVE",
  redacted_key: "ak-abc...xyz",
  created_at: "2026-01-01T00:00:00.000Z",
  expires_at: "2027-01-01T00:00:00.000Z",
  created_by_user_id: "user-123",
};

export const mockRawApiKey: RawApiKey = {
  id: "key-id-123",
  name: "ci-key",
  description: "CI pipeline key",
  key_type: "USER",
  status: "ACTIVE",
  key: "ak-full-secret-value",
  created_at: "2026-01-01T00:00:00.000Z",
  expires_at: "2027-01-01T00:00:00.000Z",
  created_by_user_id: "user-123",
};
