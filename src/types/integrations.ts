import { components } from "../__generated__/api/v2";

/** The integration category. Selects the shape of `config`. */
export type IntegrationType = components["schemas"]["IntegrationType"];

/** The LLM vendor for an `LLM` integration. */
export type LlmIntegrationProvider =
  components["schemas"]["LlmIntegrationProvider"];

/** Visibility scoping for an integration (account-wide when empty). */
export interface IntegrationScoping {
  organizationId?: string | null;
  spaceId?: string | null;
}

// ---- LLM read config (provider-discriminated union) ----

/**
 * AWS Bedrock auth settings (read), discriminated on `authType`. Secrets are
 * never returned; a configured bearer token surfaces only as `hasApiKey`.
 */
export interface AwsBedrockDefaultAuthConfig {
  authType: "DEFAULT";
  /** AWS IAM role ARN Arize assumes for cross-account access. */
  roleArn: string;
  /** External ID on the assume-role policy. Null when not set. */
  externalId: string | null;
  /** Custom Bedrock endpoint URL. Null when not set. */
  baseUrl: string | null;
}

export interface AwsBedrockBearerTokenAuthConfig {
  authType: "BEARER_TOKEN";
  /** Whether a bearer token is configured (the token is never returned). */
  hasApiKey: boolean;
  /** Custom Bedrock endpoint URL. Null when not set. */
  baseUrl: string | null;
}

export interface AwsBedrockProxyWithHeadersAuthConfig {
  authType: "PROXY_WITH_HEADERS";
  /** Proxy URL requests are forwarded to. */
  baseUrl: string;
  /** Names of the configured custom request headers (values never returned). */
  headerNames: string[];
}

/** AWS Bedrock auth (read), discriminated on `authType`. */
export type AwsBedrockAuthConfig =
  | AwsBedrockDefaultAuthConfig
  | AwsBedrockBearerTokenAuthConfig
  | AwsBedrockProxyWithHeadersAuthConfig;

/** Read config for an OpenAI LLM integration. */
export interface OpenAiLlmConfig {
  provider: "OPEN_AI";
  /** Whether an API key is configured (the key itself is never returned). */
  hasApiKey: boolean;
  /** Whether function/tool calling is enabled. */
  isFunctionCallingEnabled: boolean;
}

/** Read config for an Anthropic LLM integration. */
export interface AnthropicLlmConfig {
  provider: "ANTHROPIC";
  hasApiKey: boolean;
  isFunctionCallingEnabled: boolean;
}

/** Read config for a Google Gemini LLM integration. */
export interface GeminiLlmConfig {
  provider: "GEMINI";
  hasApiKey: boolean;
  isFunctionCallingEnabled: boolean;
}

/**
 * Read config for an AWS Bedrock LLM integration. Function/tool-calling and a
 * top-level API key do not apply; credentials live in the nested {@link auth}.
 */
export interface AwsBedrockLlmConfig {
  provider: "AWS_BEDROCK";
  /** Whether Arize's default Bedrock model catalog is enabled. */
  isDefaultModelsEnabled: boolean;
  /** Custom model names configured on this integration. Empty when none. */
  modelNames: string[];
  /** Auth settings, discriminated on `authType`. */
  auth: AwsBedrockAuthConfig;
}

/** Read config for a custom OpenAI-compatible endpoint integration. */
export interface CustomLlmConfig {
  provider: "CUSTOM";
  hasApiKey: boolean;
  isFunctionCallingEnabled: boolean;
  /** Endpoint URL requests are sent to. */
  baseUrl: string;
  /** Names of the configured custom request headers (values never returned). */
  headerNames: string[];
  isDefaultModelsEnabled: boolean;
  modelNames: string[];
}

/**
 * Read config for a Google Vertex AI integration. No credentials are stored;
 * function/tool-calling and an API key do not apply.
 */
export interface VertexAiLlmConfig {
  provider: "VERTEX_AI";
  /** GCP project ID Arize accesses Vertex through. */
  projectId: string;
  /** GCP region (e.g. us-central1). */
  location: string;
  /** Label used to verify Arize's access to the GCP project. */
  projectAccessLabel: string;
}

/** Read config for an NVIDIA NIM integration. */
export interface NvidiaNimLlmConfig {
  provider: "NVIDIA_NIM";
  hasApiKey: boolean;
  isFunctionCallingEnabled: boolean;
  /** Self-hosted NIM endpoint URL. Null when using the provider default. */
  baseUrl: string | null;
  /** Names of the configured custom request headers (values never returned). */
  headerNames: string[];
  isDefaultModelsEnabled: boolean;
  modelNames: string[];
}

/**
 * Config for an `LLM` integration — a provider-discriminated union covering all
 * supported vendors. Narrow on `provider` to access provider-specific fields.
 */
export type LlmIntegrationConfig =
  | OpenAiLlmConfig
  | AnthropicLlmConfig
  | GeminiLlmConfig
  | AwsBedrockLlmConfig
  | CustomLlmConfig
  | VertexAiLlmConfig
  | NvidiaNimLlmConfig;

/** A named, reusable request payload bound to an agent integration. */
export interface AgentRequestPreset {
  /** Server-generated, opaque preset identifier. Read-only. */
  id?: string;
  name: string;
  description?: string | null;
  /** Partial request body validated against the integration's input schema. */
  config: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Config for an `AGENT` integration. */
export interface AgentIntegrationConfig {
  /** HTTPS endpoint URL Arize calls for replay. */
  endpoint: string;
  /** Whether any headers are configured (values are never returned). */
  hasHeaders: boolean;
  /** JSON Schema (Draft-07) the endpoint's request body conforms to. */
  inputSchema: Record<string, unknown>;
  /** Named, reusable request payloads. Empty when none are configured. */
  requestPresets: AgentRequestPreset[];
}

interface IntegrationBase {
  id: string;
  name: string;
  scopings: IntegrationScoping[];
  createdAt: Date;
  updatedAt: Date;
  /** ID of the user who created the integration, or null if that user was deleted. */
  createdByUserId: string | null;
}

/** An LLM integration (a model-provider integration such as OpenAI). */
export interface LlmIntegration extends IntegrationBase {
  type: "LLM";
  config: LlmIntegrationConfig;
}

/** An agent integration (a customer-hosted HTTPS endpoint). */
export interface AgentIntegration extends IntegrationBase {
  type: "AGENT";
  description?: string | null;
  config: AgentIntegrationConfig;
}

/** A polymorphic integration resource, discriminated by `type`. */
export type Integration = LlmIntegration | AgentIntegration;

// ---- Create input types (discriminated on `type`) ----

// ---- LLM create config (provider-discriminated union) ----

/** Create role-assumption auth for AWS Bedrock. `roleArn` is required. */
export interface CreateAwsBedrockDefaultAuthInput {
  authType: "DEFAULT";
  /** AWS IAM role ARN Arize assumes for cross-account access. */
  roleArn: string;
  /** External ID on the assume-role policy. */
  externalId?: string;
  /** Custom Bedrock endpoint URL. Defaults to the provider default endpoint. */
  baseUrl?: string;
}

/** Create bearer-token auth for AWS Bedrock. `apiKey` is required (write-only). */
export interface CreateAwsBedrockBearerTokenAuthInput {
  authType: "BEARER_TOKEN";
  /** Bearer token for Bedrock (write-only, never returned). */
  apiKey: string;
  /** Custom Bedrock endpoint URL. Defaults to the provider default endpoint. */
  baseUrl?: string;
}

/** Create proxy auth for AWS Bedrock. `baseUrl` is required. */
export interface CreateAwsBedrockProxyWithHeadersAuthInput {
  authType: "PROXY_WITH_HEADERS";
  /** Proxy URL requests are forwarded to (HTTPS). */
  baseUrl: string;
  /** Custom request headers as a name-to-value map. Write-only. */
  headers?: Record<string, string>;
}

/**
 * Create/replace shape for AWS Bedrock auth, discriminated on `authType`. Also
 * used on update, where it replaces the stored auth settings wholesale.
 */
export type CreateAwsBedrockAuthInput =
  | CreateAwsBedrockDefaultAuthInput
  | CreateAwsBedrockBearerTokenAuthInput
  | CreateAwsBedrockProxyWithHeadersAuthInput;

/** Create config for an OpenAI LLM integration. `apiKey` is write-only. */
export interface CreateOpenAiLlmConfigInput {
  provider: "OPEN_AI";
  /** API key for the provider (write-only, never returned). */
  apiKey: string;
  /** Enable function/tool calling. Defaults to true server-side. */
  isFunctionCallingEnabled?: boolean;
}

/** Create config for an Anthropic LLM integration. `apiKey` is write-only. */
export interface CreateAnthropicLlmConfigInput {
  provider: "ANTHROPIC";
  apiKey: string;
  isFunctionCallingEnabled?: boolean;
}

/** Create config for a Google Gemini LLM integration. `apiKey` is write-only. */
export interface CreateGeminiLlmConfigInput {
  provider: "GEMINI";
  apiKey: string;
  isFunctionCallingEnabled?: boolean;
}

/**
 * Create config for an AWS Bedrock LLM integration. Provide a default-models
 * catalog and/or explicit `modelNames` (the server requires ≥1 model).
 */
export interface CreateAwsBedrockLlmConfigInput {
  provider: "AWS_BEDROCK";
  /** Auth settings, discriminated on `authType`. */
  auth: CreateAwsBedrockAuthInput;
  /** Enable Arize's default Bedrock model catalog. Defaults to false. */
  isDefaultModelsEnabled?: boolean;
  /** Custom model names to make available. */
  modelNames?: string[];
}

/**
 * Create config for a custom OpenAI-compatible endpoint integration. `baseUrl`
 * is required; the server requires ≥1 model (default catalog or `modelNames`).
 */
export interface CreateCustomLlmConfigInput {
  provider: "CUSTOM";
  /** Endpoint URL requests are sent to (HTTPS). */
  baseUrl: string;
  isFunctionCallingEnabled?: boolean;
  /** API key for the endpoint (write-only, never returned). */
  apiKey?: string;
  /** Custom request headers as a name-to-value map. Write-only. */
  headers?: Record<string, string>;
  isDefaultModelsEnabled?: boolean;
  modelNames?: string[];
}

/** Create config for a Google Vertex AI integration. All fields required. */
export interface CreateVertexAiLlmConfigInput {
  provider: "VERTEX_AI";
  /** GCP project ID Arize accesses Vertex through. */
  projectId: string;
  /** GCP region (e.g. us-central1). */
  location: string;
  /** Label used to verify Arize's access to the GCP project. */
  projectAccessLabel: string;
}

/**
 * Create config for an NVIDIA NIM integration. Every connection field is
 * optional; the server requires ≥1 model (default catalog or `modelNames`).
 */
export interface CreateNvidiaNimLlmConfigInput {
  provider: "NVIDIA_NIM";
  isFunctionCallingEnabled?: boolean;
  /** Self-hosted NIM endpoint URL. Defaults to the provider default endpoint. */
  baseUrl?: string;
  /** API key for the endpoint (write-only, never returned). */
  apiKey?: string;
  /** Custom request headers as a name-to-value map. Write-only. */
  headers?: Record<string, string>;
  isDefaultModelsEnabled?: boolean;
  modelNames?: string[];
}

/**
 * Config for creating an `LLM` integration — a provider-discriminated union.
 * Required fields and secrets are per-provider; secrets are write-only.
 */
export type CreateLlmIntegrationConfigInput =
  | CreateOpenAiLlmConfigInput
  | CreateAnthropicLlmConfigInput
  | CreateGeminiLlmConfigInput
  | CreateAwsBedrockLlmConfigInput
  | CreateCustomLlmConfigInput
  | CreateVertexAiLlmConfigInput
  | CreateNvidiaNimLlmConfigInput;

/** Write shape for an agent request preset on create. */
export interface CreateAgentRequestPresetInput {
  name: string;
  description?: string | null;
  config: Record<string, unknown>;
}

/** Config for creating an `AGENT` integration. */
export interface CreateAgentIntegrationConfigInput {
  endpoint: string;
  /** Cleartext header map. Encrypted at rest; never returned. */
  headers?: Record<string, string>;
  inputSchema: Record<string, unknown>;
  requestPresets?: CreateAgentRequestPresetInput[];
}

export interface CreateLlmIntegrationInput {
  type: "LLM";
  name: string;
  scopings?: IntegrationScoping[];
  config: CreateLlmIntegrationConfigInput;
}

export interface CreateAgentIntegrationInput {
  type: "AGENT";
  name: string;
  description?: string | null;
  scopings?: IntegrationScoping[];
  config: CreateAgentIntegrationConfigInput;
}

/** Discriminated create input — either an LLM or an agent integration. */
export type CreateIntegrationInput =
  | CreateLlmIntegrationInput
  | CreateAgentIntegrationInput;

// ---- Update input types (discriminated on `type`, which is immutable) ----

// ---- LLM update config (provider-discriminated union) ----
//
// `provider` is required on each variant so the union discriminates and only
// provider-applicable fields are offered. It is immutable server-side and must
// match the stored value. All other fields are optional (partial update):
// omit to keep unchanged, and — where the field type includes `null` — pass
// `null` to clear it.

/** Partial update config for an OpenAI LLM integration. */
export interface UpdateOpenAiLlmConfigInput {
  provider: "OPEN_AI";
  /** Rotate the API key. Pass null to clear it. Omit to keep unchanged. */
  apiKey?: string | null;
  isFunctionCallingEnabled?: boolean;
}

/** Partial update config for an Anthropic LLM integration. */
export interface UpdateAnthropicLlmConfigInput {
  provider: "ANTHROPIC";
  apiKey?: string | null;
  isFunctionCallingEnabled?: boolean;
}

/** Partial update config for a Google Gemini LLM integration. */
export interface UpdateGeminiLlmConfigInput {
  provider: "GEMINI";
  apiKey?: string | null;
  isFunctionCallingEnabled?: boolean;
}

/**
 * Partial update config for an AWS Bedrock LLM integration. `auth` replaces the
 * stored auth settings wholesale.
 */
export interface UpdateAwsBedrockLlmConfigInput {
  provider: "AWS_BEDROCK";
  /** Replacement auth settings (replaces stored auth wholesale). */
  auth?: CreateAwsBedrockAuthInput;
  isDefaultModelsEnabled?: boolean;
  /** Replaces the custom model list. */
  modelNames?: string[];
}

/** Partial update config for a custom OpenAI-compatible endpoint integration. */
export interface UpdateCustomLlmConfigInput {
  provider: "CUSTOM";
  apiKey?: string | null;
  isFunctionCallingEnabled?: boolean;
  /** New endpoint URL. Null is rejected by the server (base_url is required). */
  baseUrl?: string | null;
  /** Replaces the full custom-header set. Pass null to clear all headers. */
  headers?: Record<string, string> | null;
  isDefaultModelsEnabled?: boolean;
  modelNames?: string[];
}

/** Partial update config for an NVIDIA NIM integration. */
export interface UpdateNvidiaNimLlmConfigInput {
  provider: "NVIDIA_NIM";
  apiKey?: string | null;
  isFunctionCallingEnabled?: boolean;
  /** New endpoint URL. Pass null to fall back to the provider default. */
  baseUrl?: string | null;
  /** Replaces the full custom-header set. Pass null to clear all headers. */
  headers?: Record<string, string> | null;
  isDefaultModelsEnabled?: boolean;
  modelNames?: string[];
}

/**
 * Partial update config for a Google Vertex AI integration. Fields are
 * required on the resource, so they may change but are never cleared
 * (per-scalar deep-merge).
 */
export interface UpdateVertexAiLlmConfigInput {
  provider: "VERTEX_AI";
  projectId?: string;
  location?: string;
  projectAccessLabel?: string;
}

/**
 * Partial config for updating an `LLM` integration — a provider-discriminated
 * union. `provider` is required (it selects the variant), immutable, and must
 * match the stored value.
 */
export type UpdateLlmIntegrationConfigInput =
  | UpdateOpenAiLlmConfigInput
  | UpdateAnthropicLlmConfigInput
  | UpdateGeminiLlmConfigInput
  | UpdateAwsBedrockLlmConfigInput
  | UpdateCustomLlmConfigInput
  | UpdateVertexAiLlmConfigInput
  | UpdateNvidiaNimLlmConfigInput;

/** Write shape for an agent request preset on update. */
export interface UpdateAgentRequestPresetInput {
  name: string;
  description?: string | null;
  config: Record<string, unknown>;
}

/** Partial config for updating an `AGENT` integration (replace-on-provide). */
export interface UpdateAgentIntegrationConfigInput {
  endpoint?: string;
  /** Replace-on-provide. Pass null to clear all headers. */
  headers?: Record<string, string> | null;
  inputSchema?: Record<string, unknown>;
  /** Replace-on-provide preset list, matched by `name`. */
  requestPresets?: UpdateAgentRequestPresetInput[];
}

export interface UpdateLlmIntegrationInput {
  type: "LLM";
  name?: string;
  scopings?: IntegrationScoping[];
  config?: UpdateLlmIntegrationConfigInput;
}

export interface UpdateAgentIntegrationInput {
  type: "AGENT";
  name?: string;
  description?: string | null;
  scopings?: IntegrationScoping[];
  config?: UpdateAgentIntegrationConfigInput;
}

/** Discriminated update input. `type` is required (selects the variant) and immutable. */
export type UpdateIntegrationInput =
  | UpdateLlmIntegrationInput
  | UpdateAgentIntegrationInput;
