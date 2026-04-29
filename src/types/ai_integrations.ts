import { components } from "../__generated__/api/v2";

export type AiIntegrationProvider =
  components["schemas"]["AiIntegrationProvider"];

export type AiIntegrationAuthType =
  components["schemas"]["AiIntegrationAuthType"];

export type AwsProviderMetadata = components["schemas"]["AwsProviderMetadata"];
export type GcpProviderMetadata = components["schemas"]["GcpProviderMetadata"];
export type ProviderMetadata = AwsProviderMetadata | GcpProviderMetadata;

export interface AiIntegrationScoping {
  organizationId?: string | null;
  spaceId?: string | null;
}

export interface AiIntegration {
  id: string;
  name: string;
  provider: AiIntegrationProvider;
  hasApiKey: boolean;
  baseUrl?: string | null;
  modelNames?: string[] | null;
  headers?: Record<string, string> | null;
  enableDefaultModels: boolean;
  functionCallingEnabled: boolean;
  authType: AiIntegrationAuthType;
  providerMetadata?: ProviderMetadata | null;
  scopings: AiIntegrationScoping[];
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string;
}

export type CreateAiIntegrationInput = {
  name: string;
  provider: AiIntegrationProvider;
  apiKey?: string;
  baseUrl?: string;
  modelNames?: string[];
  headers?: Record<string, string>;
  enableDefaultModels?: boolean;
  functionCallingEnabled?: boolean;
  authType?: AiIntegrationAuthType;
  providerMetadata?: ProviderMetadata;
  scopings?: AiIntegrationScoping[];
};

export type UpdateAiIntegrationInput = {
  name?: string;
  provider?: AiIntegrationProvider;
  apiKey?: string | null;
  baseUrl?: string | null;
  modelNames?: string[];
  headers?: Record<string, string> | null;
  enableDefaultModels?: boolean;
  functionCallingEnabled?: boolean;
  authType?: AiIntegrationAuthType;
  providerMetadata?: ProviderMetadata | null;
  scopings?: AiIntegrationScoping[];
};
