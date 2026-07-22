import { ApiKey, ApiKeyCreated } from "../types";
import { RawApiKey, RawApiKeyCreated } from "../types/internal";

function assertUnreachable(x: never): never {
  throw new Error(`Unhandled key_type: ${JSON.stringify(x)}`);
}

export function transformApiKey(apiKey: RawApiKey): ApiKey {
  const {
    key_type,
    redacted_key,
    created_at,
    expires_at,
    created_by_user_id,
    last_used_at,
    ...rest
  } = apiKey;
  return {
    ...rest,
    keyType: key_type,
    redactedKey: redacted_key,
    createdAt: new Date(created_at),
    expiresAt: expires_at ? new Date(expires_at) : undefined,
    createdByUserId: created_by_user_id,
    lastUsedAt: last_used_at ? new Date(last_used_at) : undefined,
  };
}

export function transformApiKeyCreated(
  apiKey: RawApiKeyCreated,
): ApiKeyCreated {
  if (apiKey.key_type === "SERVICE") {
    const { key, bot_user, ...rest } = apiKey;
    return {
      ...transformApiKey(rest),
      key,
      botUser: {
        id: bot_user.id,
        name: bot_user.name,
        accountRole: bot_user.account_role,
        organizations: bot_user.organizations.map((o) => ({
          orgId: o.org_id,
          role: o.role,
          spaces: o.spaces.map((s) => ({
            spaceId: s.space_id,
            role: s.role,
          })),
        })),
      },
    };
  } else if (apiKey.key_type === "USER") {
    const { key, ...rest } = apiKey;
    return {
      ...transformApiKey(rest),
      key,
    };
  } else {
    return assertUnreachable(apiKey);
  }
}
