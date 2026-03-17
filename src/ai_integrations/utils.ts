import { AiIntegration, AiIntegrationScoping } from "../types";
import { RawAiIntegration } from "../types/internal";

function transformScoping(
  scoping: RawAiIntegration["scopings"][number],
): AiIntegrationScoping {
  return {
    organizationId: scoping.organization_id,
    spaceId: scoping.space_id,
  };
}

export function toRawScoping(
  scoping: AiIntegrationScoping,
): RawAiIntegration["scopings"][number] {
  return {
    organization_id: scoping.organizationId,
    space_id: scoping.spaceId,
  };
}

export function transformAiIntegration(
  integration: RawAiIntegration,
): AiIntegration {
  return {
    id: integration.id,
    name: integration.name,
    provider: integration.provider,
    hasApiKey: integration.has_api_key,
    baseUrl: integration.base_url,
    modelNames: integration.model_names,
    headers: integration.headers,
    enableDefaultModels: integration.enable_default_models,
    functionCallingEnabled: integration.function_calling_enabled,
    authType: integration.auth_type,
    providerMetadata: integration.provider_metadata,
    scopings: integration.scopings.map(transformScoping),
    createdAt: new Date(integration.created_at),
    updatedAt: new Date(integration.updated_at),
    createdByUserId: integration.created_by_user_id,
  };
}
