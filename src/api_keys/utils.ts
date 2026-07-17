import { ApiKey, ApiKeyRedacted } from "../types";
import { RawApiKey, RawApiKeyRedacted } from "../types/internal";

export function transformApiKeyRedacted(
  apiKey: RawApiKeyRedacted,
): ApiKeyRedacted {
  const {
    key_type,
    redacted_key,
    created_at,
    expires_at,
    created_by_user_id,
    ...rest
  } = apiKey;
  return {
    ...rest,
    keyType: key_type,
    redactedKey: redacted_key,
    createdAt: new Date(created_at),
    expiresAt: expires_at ? new Date(expires_at) : undefined,
    createdByUserId: created_by_user_id,
  };
}

export function transformApiKey(apiKey: RawApiKey): ApiKey {
  const { key_type, created_at, expires_at, created_by_user_id, ...rest } =
    apiKey;
  return {
    ...rest,
    keyType: key_type,
    createdAt: new Date(created_at),
    expiresAt: expires_at ? new Date(expires_at) : undefined,
    createdByUserId: created_by_user_id,
  };
}
