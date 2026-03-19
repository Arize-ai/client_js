import {
  Evaluator,
  EvaluatorLlmConfig,
  EvaluatorVersion,
  EvaluatorWithVersion,
  TemplateConfig,
} from "../types";
import {
  RawEvaluator,
  RawEvaluatorLlmConfig,
  RawEvaluatorVersion,
  RawEvaluatorWithVersion,
  RawTemplateConfig,
} from "../types/internal";

export function templateConfigToRaw(config: TemplateConfig): RawTemplateConfig {
  return {
    name: config.name,
    template: config.template,
    include_explanations: config.includeExplanations,
    use_function_calling_if_available: config.useFunctionCallingIfAvailable,
    classification_choices: config.classificationChoices,
    direction: config.direction,
    data_granularity: config.dataGranularity,
    llm_config: {
      ai_integration_id: config.llmConfig.aiIntegrationId,
      model_name: config.llmConfig.modelName,
      invocation_parameters: config.llmConfig.invocationParameters,
      provider_parameters: config.llmConfig.providerParameters,
    },
  };
}

export function transformEvaluatorLlmConfig(
  raw: RawEvaluatorLlmConfig,
): EvaluatorLlmConfig {
  return {
    aiIntegrationId: raw.ai_integration_id,
    modelName: raw.model_name,
    invocationParameters: raw.invocation_parameters,
    providerParameters: raw.provider_parameters,
  };
}

export function transformTemplateConfig(
  raw: RawTemplateConfig,
): TemplateConfig {
  return {
    name: raw.name,
    template: raw.template,
    includeExplanations: raw.include_explanations,
    useFunctionCallingIfAvailable: raw.use_function_calling_if_available,
    classificationChoices: raw.classification_choices,
    direction: raw.direction,
    dataGranularity: raw.data_granularity,
    llmConfig: transformEvaluatorLlmConfig(raw.llm_config),
  };
}

export function transformEvaluatorVersion(
  raw: RawEvaluatorVersion,
): EvaluatorVersion {
  return {
    id: raw.id,
    evaluatorId: raw.evaluator_id,
    commitHash: raw.commit_hash,
    commitMessage: raw.commit_message,
    templateConfig: transformTemplateConfig(raw.template_config),
    createdAt: new Date(raw.created_at),
    createdByUserId: raw.created_by_user_id,
  };
}

export function transformEvaluator(raw: RawEvaluator): Evaluator {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    type: raw.type,
    spaceId: raw.space_id,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
    createdByUserId: raw.created_by_user_id,
  };
}

export function transformEvaluatorWithVersion(
  raw: RawEvaluatorWithVersion,
): EvaluatorWithVersion {
  return {
    ...transformEvaluator(raw),
    version: transformEvaluatorVersion(raw.version),
  };
}
