import { ApiKey, ApiKeyCreated } from "../types";
import { RawApiKey, RawApiKeyCreated } from "../types/internal";

export function transformApiKey(apiKey: RawApiKey): ApiKey {
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

export function transformApiKeyCreated(
  apiKey: RawApiKeyCreated,
): ApiKeyCreated {
  const { key, ...rest } = apiKey;
  return {
    ...transformApiKey(rest),
    key,
  };
}
