import {
  AgentRequestPreset,
  AwsBedrockAuthConfig,
  CreateAgentRequestPresetInput,
  CreateAwsBedrockAuthInput,
  CreateIntegrationInput,
  CreateLlmIntegrationConfigInput,
  EvaluatorIntegration,
  Integration,
  IntegrationScoping,
  LlmIntegrationConfig,
  UpdateAgentRequestPresetInput,
  UpdateIntegrationInput,
  UpdateLlmIntegrationConfigInput,
} from "../types";
import {
  RawAgentRequestPreset,
  RawAwsBedrockAuth,
  RawCreateAwsBedrockAuth,
  RawCreateIntegrationRequest,
  RawCreateLlmConfig,
  RawIntegration,
  RawIntegrationScoping,
  RawLlmConfig,
  RawUpdateIntegrationRequest,
  RawUpdateLlmConfig,
} from "../types/internal";
import { assertUnreachable } from "../utils/assertUnreachable";

function transformScoping(scoping: RawIntegrationScoping): IntegrationScoping {
  return {
    organizationId: scoping.organization_id,
    spaceId: scoping.space_id,
  };
}

export function toRawScoping(
  scoping: IntegrationScoping,
): RawIntegrationScoping {
  return {
    organization_id: scoping.organizationId,
    space_id: scoping.spaceId,
  };
}

function transformRequestPreset(
  preset: RawAgentRequestPreset,
): AgentRequestPreset {
  return {
    id: preset.id,
    name: preset.name,
    description: preset.description,
    config: preset.config,
    createdAt: preset.created_at ? new Date(preset.created_at) : undefined,
    updatedAt: preset.updated_at ? new Date(preset.updated_at) : undefined,
  };
}

/** Map a raw AWS Bedrock auth object to its camelCase read shape. */
function transformBedrockAuth(auth: RawAwsBedrockAuth): AwsBedrockAuthConfig {
  switch (auth.auth_type) {
    case "DEFAULT":
      return {
        authType: "DEFAULT",
        roleArn: auth.role_arn,
        externalId: auth.external_id,
        baseUrl: auth.base_url,
      };
    case "BEARER_TOKEN":
      return {
        authType: "BEARER_TOKEN",
        hasApiKey: auth.has_api_key,
        baseUrl: auth.base_url,
      };
    case "PROXY_WITH_HEADERS":
      return {
        authType: "PROXY_WITH_HEADERS",
        baseUrl: auth.base_url,
        headerNames: auth.header_names,
      };
    default:
      return assertUnreachable(auth);
  }
}

/**
 * Map a raw {@link RawLlmConfig} to its camelCase read shape. Switches on the
 * `provider` discriminator; every supported provider is mapped.
 */
function transformLlmConfig(config: RawLlmConfig): LlmIntegrationConfig {
  switch (config.provider) {
    case "OPEN_AI":
      return {
        provider: "OPEN_AI",
        hasApiKey: config.has_api_key,
        isFunctionCallingEnabled: config.is_function_calling_enabled,
      };
    case "ANTHROPIC":
      return {
        provider: "ANTHROPIC",
        hasApiKey: config.has_api_key,
        isFunctionCallingEnabled: config.is_function_calling_enabled,
      };
    case "GEMINI":
      return {
        provider: "GEMINI",
        hasApiKey: config.has_api_key,
        isFunctionCallingEnabled: config.is_function_calling_enabled,
      };
    case "AWS_BEDROCK":
      return {
        provider: "AWS_BEDROCK",
        isDefaultModelsEnabled: config.is_default_models_enabled,
        modelNames: config.model_names,
        auth: transformBedrockAuth(config.auth),
      };
    case "CUSTOM":
      return {
        provider: "CUSTOM",
        hasApiKey: config.has_api_key,
        isFunctionCallingEnabled: config.is_function_calling_enabled,
        baseUrl: config.base_url,
        headerNames: config.header_names,
        isDefaultModelsEnabled: config.is_default_models_enabled,
        modelNames: config.model_names,
      };
    case "VERTEX_AI":
      return {
        provider: "VERTEX_AI",
        projectId: config.project_id,
        location: config.location,
        projectAccessLabel: config.project_access_label,
      };
    case "NVIDIA_NIM":
      return {
        provider: "NVIDIA_NIM",
        hasApiKey: config.has_api_key,
        isFunctionCallingEnabled: config.is_function_calling_enabled,
        baseUrl: config.base_url,
        headerNames: config.header_names,
        isDefaultModelsEnabled: config.is_default_models_enabled,
        modelNames: config.model_names,
      };
    case "LITELLM":
      return {
        provider: "LITELLM",
        hasApiKey: config.has_api_key,
        isFunctionCallingEnabled: config.is_function_calling_enabled,
        baseUrl: config.base_url,
        headerNames: config.header_names,
        modelNames: config.model_names,
      };
    case "FIREWORKS":
      return {
        provider: "FIREWORKS",
        hasApiKey: config.has_api_key,
        isFunctionCallingEnabled: config.is_function_calling_enabled,
        isDefaultModelsEnabled: config.is_default_models_enabled,
        modelNames: config.model_names,
      };
    case "TOGETHER_AI":
      return {
        provider: "TOGETHER_AI",
        hasApiKey: config.has_api_key,
        isFunctionCallingEnabled: config.is_function_calling_enabled,
        isDefaultModelsEnabled: config.is_default_models_enabled,
        modelNames: config.model_names,
      };
    default:
      return assertUnreachable(config);
  }
}

/**
 * Transform a raw {@link Integration} response into the user-facing camelCase
 * shape. Switches on the `type` discriminator: `LLM` maps the per-provider
 * config, `AGENT` maps the endpoint config and its nested request presets.
 */
export function transformIntegration(integration: RawIntegration): Integration {
  const base = {
    id: integration.id,
    name: integration.name,
    scopings: integration.scopings.map(transformScoping),
    createdAt: new Date(integration.created_at),
    updatedAt: new Date(integration.updated_at),
    createdByUserId: integration.created_by_user_id,
  };

  const type = integration.type;
  switch (type) {
    case "LLM":
      return {
        ...base,
        type: "LLM",
        config: transformLlmConfig(integration.config),
      };
    case "AGENT":
      return {
        ...base,
        type: "AGENT",
        description: integration.description,
        config: {
          endpoint: integration.config.endpoint,
          hasHeaders: integration.config.has_headers,
          inputSchema: integration.config.input_schema,
          requestPresets: integration.config.request_presets.map(
            transformRequestPreset,
          ),
        },
      };
    case "EVALUATOR": {
      const evaluatorIntegration = integration as Extract<
        RawIntegration,
        { type: "EVALUATOR" }
      >;
      return {
        ...base,
        type: "EVALUATOR",
        description: evaluatorIntegration.description,
        config: {
          endpoint: evaluatorIntegration.config.endpoint,
          hasHeaders: evaluatorIntegration.config.has_headers,
          inputSchema: evaluatorIntegration.config.input_schema,
        },
      } satisfies EvaluatorIntegration;
    }
    default:
      return assertUnreachable(type);
  }
}

function toRawCreatePreset(preset: CreateAgentRequestPresetInput) {
  return {
    name: preset.name,
    description: preset.description,
    config: preset.config,
  };
}

/** Convert a {@link CreateAwsBedrockAuthInput} into its raw request shape. */
function toRawCreateBedrockAuth(
  auth: CreateAwsBedrockAuthInput,
): RawCreateAwsBedrockAuth {
  switch (auth.authType) {
    case "DEFAULT":
      return {
        auth_type: "DEFAULT",
        role_arn: auth.roleArn,
        external_id: auth.externalId,
        base_url: auth.baseUrl,
      };
    case "BEARER_TOKEN":
      return {
        auth_type: "BEARER_TOKEN",
        api_key: auth.apiKey,
        base_url: auth.baseUrl,
      };
    case "PROXY_WITH_HEADERS":
      return {
        auth_type: "PROXY_WITH_HEADERS",
        base_url: auth.baseUrl,
        headers: auth.headers,
      };
    default:
      return assertUnreachable(auth);
  }
}

/**
 * Convert a discriminated {@link CreateLlmIntegrationConfigInput} into the raw
 * `CreateLlmConfig` union member for its `provider`. All 7 providers are mapped.
 */
function toRawCreateLlmConfig(
  config: CreateLlmIntegrationConfigInput,
): RawCreateLlmConfig {
  switch (config.provider) {
    case "OPEN_AI":
      return {
        provider: "OPEN_AI",
        api_key: config.apiKey,
        is_function_calling_enabled: config.isFunctionCallingEnabled,
      };
    case "ANTHROPIC":
      return {
        provider: "ANTHROPIC",
        api_key: config.apiKey,
        is_function_calling_enabled: config.isFunctionCallingEnabled,
      };
    case "GEMINI":
      return {
        provider: "GEMINI",
        api_key: config.apiKey,
        is_function_calling_enabled: config.isFunctionCallingEnabled,
      };
    case "AWS_BEDROCK":
      return {
        provider: "AWS_BEDROCK",
        auth: toRawCreateBedrockAuth(config.auth),
        is_default_models_enabled: config.isDefaultModelsEnabled,
        model_names: config.modelNames,
      };
    case "CUSTOM":
      return {
        provider: "CUSTOM",
        base_url: config.baseUrl,
        is_function_calling_enabled: config.isFunctionCallingEnabled,
        api_key: config.apiKey,
        headers: config.headers,
        is_default_models_enabled: config.isDefaultModelsEnabled,
        model_names: config.modelNames,
      };
    case "VERTEX_AI":
      return {
        provider: "VERTEX_AI",
        project_id: config.projectId,
        location: config.location,
        project_access_label: config.projectAccessLabel,
      };
    case "NVIDIA_NIM":
      return {
        provider: "NVIDIA_NIM",
        is_function_calling_enabled: config.isFunctionCallingEnabled,
        base_url: config.baseUrl,
        api_key: config.apiKey,
        headers: config.headers,
        is_default_models_enabled: config.isDefaultModelsEnabled,
        model_names: config.modelNames,
      };
    case "LITELLM":
      return {
        provider: "LITELLM",
        is_function_calling_enabled: config.isFunctionCallingEnabled,
        base_url: config.baseUrl,
        api_key: config.apiKey,
        headers: config.headers,
        model_names: config.modelNames,
      };
    case "FIREWORKS":
      return {
        provider: "FIREWORKS",
        is_function_calling_enabled: config.isFunctionCallingEnabled,
        api_key: config.apiKey,
        is_default_models_enabled: config.isDefaultModelsEnabled,
        model_names: config.modelNames,
      };
    case "TOGETHER_AI":
      return {
        provider: "TOGETHER_AI",
        is_function_calling_enabled: config.isFunctionCallingEnabled,
        api_key: config.apiKey,
        is_default_models_enabled: config.isDefaultModelsEnabled,
        model_names: config.modelNames,
      };
    default:
      return assertUnreachable(config);
  }
}

/**
 * Convert a discriminated {@link CreateIntegrationInput} into the raw request
 * body. Switches on `type` — LLM maps the per-provider config, AGENT maps the
 * endpoint config and nested request presets.
 */
export function toRawCreateIntegration(
  input: CreateIntegrationInput,
): RawCreateIntegrationRequest {
  switch (input.type) {
    case "LLM":
      return {
        type: "LLM",
        name: input.name,
        scopings: input.scopings?.map(toRawScoping),
        config: toRawCreateLlmConfig(input.config),
      };
    case "AGENT":
      return {
        type: "AGENT",
        name: input.name,
        description: input.description,
        scopings: input.scopings?.map(toRawScoping),
        config: {
          endpoint: input.config.endpoint,
          headers: input.config.headers,
          input_schema: input.config.inputSchema,
          request_presets: input.config.requestPresets?.map(toRawCreatePreset),
        },
      };
    case "EVALUATOR":
      return {
        type: "EVALUATOR",
        name: input.name,
        description: input.description,
        scopings: input.scopings?.map(toRawScoping),
        config: {
          endpoint: input.config.endpoint,
          headers: input.config.headers,
          input_schema: input.config.inputSchema,
        },
      };
    default:
      return assertUnreachable(input);
  }
}

function toRawUpdatePreset(preset: UpdateAgentRequestPresetInput) {
  return {
    name: preset.name,
    description: preset.description,
    config: preset.config,
  };
}

/**
 * Convert a discriminated {@link UpdateLlmIntegrationConfigInput} into the flat
 * raw `UpdateLlmConfig`. Only the fields applicable to the config's `provider`
 * are emitted; `provider` is always sent so the server can verify it matches.
 */
function toRawUpdateLlmConfig(
  config: UpdateLlmIntegrationConfigInput,
): RawUpdateLlmConfig {
  switch (config.provider) {
    case "OPEN_AI":
    case "ANTHROPIC":
    case "GEMINI":
      return {
        provider: config.provider,
        api_key: config.apiKey,
        is_function_calling_enabled: config.isFunctionCallingEnabled,
      };
    case "AWS_BEDROCK":
      return {
        provider: "AWS_BEDROCK",
        auth: config.auth ? toRawCreateBedrockAuth(config.auth) : undefined,
        is_default_models_enabled: config.isDefaultModelsEnabled,
        model_names: config.modelNames,
      };
    case "CUSTOM":
    case "NVIDIA_NIM":
      return {
        provider: config.provider,
        api_key: config.apiKey,
        is_function_calling_enabled: config.isFunctionCallingEnabled,
        base_url: config.baseUrl,
        headers: config.headers,
        is_default_models_enabled: config.isDefaultModelsEnabled,
        model_names: config.modelNames,
      };
    case "LITELLM":
      return {
        provider: "LITELLM",
        api_key: config.apiKey,
        is_function_calling_enabled: config.isFunctionCallingEnabled,
        base_url: config.baseUrl,
        headers: config.headers,
        model_names: config.modelNames,
      };
    case "FIREWORKS":
      return {
        provider: "FIREWORKS",
        api_key: config.apiKey,
        is_function_calling_enabled: config.isFunctionCallingEnabled,
        is_default_models_enabled: config.isDefaultModelsEnabled,
        model_names: config.modelNames,
      };
    case "TOGETHER_AI":
      return {
        provider: "TOGETHER_AI",
        api_key: config.apiKey,
        is_function_calling_enabled: config.isFunctionCallingEnabled,
        is_default_models_enabled: config.isDefaultModelsEnabled,
        model_names: config.modelNames,
      };
    case "VERTEX_AI":
      return {
        provider: "VERTEX_AI",
        project_id: config.projectId,
        location: config.location,
        project_access_label: config.projectAccessLabel,
      };
    default:
      return assertUnreachable(config);
  }
}

/**
 * Convert a discriminated {@link UpdateIntegrationInput} into the raw PATCH
 * body. `type` selects the per-type shape and is immutable server-side.
 */
export function toRawUpdateIntegration(
  input: UpdateIntegrationInput,
): RawUpdateIntegrationRequest {
  switch (input.type) {
    case "LLM":
      return {
        type: "LLM",
        name: input.name,
        scopings: input.scopings?.map(toRawScoping),
        config: input.config ? toRawUpdateLlmConfig(input.config) : undefined,
      };
    case "AGENT":
      return {
        type: "AGENT",
        name: input.name,
        description: input.description,
        scopings: input.scopings?.map(toRawScoping),
        config: input.config
          ? {
              endpoint: input.config.endpoint,
              headers: input.config.headers,
              input_schema: input.config.inputSchema,
              request_presets:
                input.config.requestPresets?.map(toRawUpdatePreset),
            }
          : undefined,
      };
    case "EVALUATOR":
      return {
        type: "EVALUATOR",
        name: input.name,
        description: input.description,
        scopings: input.scopings?.map(toRawScoping),
        config: input.config
          ? {
              endpoint: input.config.endpoint,
              headers: input.config.headers,
              input_schema: input.config.inputSchema,
            }
          : undefined,
      };
    default:
      return assertUnreachable(input);
  }
}
