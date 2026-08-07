import { RawIntegration, RawLlmConfig } from "../../types/internal";

export const mockDateString = "2026-02-13T21:27:19.055Z";
export const mockUpdatedDateString = "2026-02-13T21:27:19.279Z";
const mockLlmId = "TGxtSW50ZWdyYXRpb246MTI6YUJjRA==";
const mockAgentId = "QWdlbnRJbnRlZ3JhdGlvbjoxMjphQmNE";
const mockUserId = "VXNlcjoxOm5OYkM=";

/** Build an LLM integration fixture around a per-provider config. */
export function makeLlmIntegration(config: RawLlmConfig): RawIntegration {
  return {
    id: mockLlmId,
    type: "LLM",
    name: "Production LLM",
    scopings: [{ organization_id: null, space_id: null }],
    created_at: mockDateString,
    updated_at: mockUpdatedDateString,
    created_by_user_id: mockUserId,
    config,
  };
}

export const mockLlmIntegration = makeLlmIntegration({
  provider: "OPEN_AI",
  has_api_key: true,
  is_function_calling_enabled: true,
});

/** One raw read config per provider (all 3 Bedrock auth variants covered). */
export const rawLlmConfigs = {
  OPEN_AI: {
    provider: "OPEN_AI",
    has_api_key: true,
    is_function_calling_enabled: true,
  },
  ANTHROPIC: {
    provider: "ANTHROPIC",
    has_api_key: false,
    is_function_calling_enabled: true,
  },
  GEMINI: {
    provider: "GEMINI",
    has_api_key: true,
    is_function_calling_enabled: false,
  },
  AWS_BEDROCK_DEFAULT: {
    provider: "AWS_BEDROCK",
    is_default_models_enabled: true,
    model_names: ["anthropic.claude-3-sonnet"],
    auth: {
      auth_type: "DEFAULT",
      role_arn: "arn:aws:iam::123456789012:role/arize",
      external_id: "ext-123",
      base_url: null,
    },
  },
  AWS_BEDROCK_BEARER: {
    provider: "AWS_BEDROCK",
    is_default_models_enabled: false,
    model_names: ["custom.model"],
    auth: {
      auth_type: "BEARER_TOKEN",
      has_api_key: true,
      base_url: "https://bedrock.example.com",
    },
  },
  AWS_BEDROCK_PROXY: {
    provider: "AWS_BEDROCK",
    is_default_models_enabled: true,
    model_names: [],
    auth: {
      auth_type: "PROXY_WITH_HEADERS",
      base_url: "https://proxy.example.com",
      header_names: ["x-api-key", "x-tenant"],
    },
  },
  CUSTOM: {
    provider: "CUSTOM",
    has_api_key: true,
    is_function_calling_enabled: true,
    base_url: "https://custom.example.com/v1",
    header_names: ["x-custom"],
    is_default_models_enabled: false,
    model_names: ["gpt-oss-20b"],
  },
  VERTEX_AI: {
    provider: "VERTEX_AI",
    project_id: "my-gcp-project",
    location: "us-central1",
    project_access_label: "arize-access",
  },
  NVIDIA_NIM: {
    provider: "NVIDIA_NIM",
    has_api_key: false,
    is_function_calling_enabled: true,
    base_url: null,
    header_names: [],
    is_default_models_enabled: true,
    model_names: ["meta/llama-3.1-8b-instruct"],
  },
} satisfies Record<string, RawLlmConfig>;

export const mockAgentIntegration: RawIntegration = {
  id: mockAgentId,
  type: "AGENT",
  name: "My Support Agent",
  description: "Replays support conversations",
  scopings: [{ organization_id: "T3JnOjE=", space_id: "U3BhY2U6NDU2OmRlZg==" }],
  created_at: mockDateString,
  updated_at: mockUpdatedDateString,
  created_by_user_id: null,
  config: {
    endpoint: "https://agent.example.com/replay",
    has_headers: true,
    input_schema: {
      type: "object",
      properties: { input: { type: "string" } },
    },
    request_presets: [
      {
        id: "cHJlc2V0OjE=",
        name: "default",
        description: "default preset",
        config: { input: "hello" },
        created_at: mockDateString,
        updated_at: mockUpdatedDateString,
      },
    ],
  },
};
