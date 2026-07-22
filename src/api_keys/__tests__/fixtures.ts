import { components } from "../../__generated__/api/v2";
import { RawApiKey, RawApiKeyCreated } from "../../types/internal";

export const mockRawApiKey: RawApiKey = {
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

export const mockRawApiKeyCreated: RawApiKeyCreated = {
  ...mockRawApiKey,
  key_type: "USER",
  key: "ak-full-secret-value",
};

export const mockRawServiceApiKeyCreated: components["schemas"]["ServiceApiKeyCreated"] =
  {
    id: "key-id-456",
    name: "bot-key",
    description: "Service key for CI",
    key_type: "SERVICE",
    status: "ACTIVE",
    redacted_key: "ak-bot...abc",
    created_at: "2026-01-01T00:00:00.000Z",
    created_by_user_id: "user-123",
    key: "ak-bot-full-secret",
    bot_user: {
      id: "bot-user-456",
      name: "bot-key",
      account_role: { name: "MEMBER" },
      organizations: [
        {
          org_id: "T3JnMTIz",
          role: { name: "READ_ONLY" },
          spaces: [{ space_id: "U3BhY2UxMjM", role: { name: "MEMBER" } }],
        },
      ],
    },
  };
