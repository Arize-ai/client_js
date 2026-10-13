import {
  ApiKey,
  ApiKeyRefreshed,
  ApiKeyStatus,
  CreatedApiKey,
  ServiceKeyBotUser,
} from "../types";
import {
  RawApiKey,
  RawCreatedApiKey,
  RawRefreshApiKey,
  RawServiceKeyBotUser,
} from "../types/internal";

function assertUnreachable(x: never): never {
  throw new Error(`Unhandled key_type: ${JSON.stringify(x)}`);
}

function transformBotUser(botUser: RawServiceKeyBotUser): ServiceKeyBotUser {
  return {
    id: botUser.id,
    name: botUser.name,
    accountRole: botUser.account_role,
    organizations: botUser.organizations.map((o) => ({
      orgId: o.org_id,
      role: o.role,
      spaces: o.spaces.map((s) => ({
        spaceId: s.space_id,
        role: s.role,
      })),
    })),
  };
}

function transformCommonApiKeyFields(apiKey: {
  id: string;
  name: string;
  description?: string;
  status: ApiKeyStatus;
  redacted_key: string;
  created_at: string;
  expires_at?: string;
  created_by_user_id: string;
  last_used_at?: string;
}) {
  const {
    id,
    name,
    description,
    status,
    redacted_key,
    created_at,
    expires_at,
    created_by_user_id,
    last_used_at,
  } = apiKey;
  return {
    id,
    name,
    description,
    status,
    redactedKey: redacted_key,
    createdAt: new Date(created_at),
    expiresAt: expires_at ? new Date(expires_at) : undefined,
    createdByUserId: created_by_user_id,
    lastUsedAt: last_used_at ? new Date(last_used_at) : undefined,
  };
}

export function transformApiKey(apiKey: RawApiKey): ApiKey {
  if (apiKey.key_type === "SERVICE") {
    return {
      ...transformCommonApiKeyFields(apiKey),
      keyType: "SERVICE",
      botUser: transformBotUser(apiKey.bot_user),
    };
  } else if (apiKey.key_type === "USER") {
    return {
      ...transformCommonApiKeyFields(apiKey),
      keyType: "USER",
    };
  } else {
    return assertUnreachable(apiKey);
  }
}

export function transformRefreshedApiKey(
  apiKey: RawRefreshApiKey,
): ApiKeyRefreshed {
  return {
    ...transformCommonApiKeyFields(apiKey),
    keyType: apiKey.key_type,
    key: apiKey.key,
  };
}

export function transformCreatedApiKey(
  apiKey: RawCreatedApiKey,
): CreatedApiKey {
  if (apiKey.key_type === "SERVICE") {
    const { key, bot_user } = apiKey;
    return {
      ...transformCommonApiKeyFields(apiKey),
      keyType: "SERVICE",
      key,
      botUser: transformBotUser(bot_user),
    };
  } else if (apiKey.key_type === "USER") {
    const { key } = apiKey;
    return {
      ...transformCommonApiKeyFields(apiKey),
      keyType: "USER",
      key,
    };
  } else {
    return assertUnreachable(apiKey);
  }
}
