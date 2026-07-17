import {
  CodeConfig,
  Evaluator,
  EvaluatorLlmConfig,
  EvaluatorVersion,
  EvaluatorWithVersion,
  ManagedCodeConfig,
  StaticParam,
  TemplateConfig,
} from "../types";
import {
  RawCodeConfig,
  RawCustomCodeConfig,
  RawEvaluator,
  RawEvaluatorLlmConfig,
  RawEvaluatorVersion,
  RawEvaluatorWithVersion,
  RawManagedCodeConfig,
  RawStaticParam,
  RawTemplateConfig,
} from "../types/internal";

export function templateConfigToRaw(config: TemplateConfig): RawTemplateConfig {
  return {
    name: config.name,
    template: config.template,
    include_explanations: config.includeExplanations,
    use_function_calling_if_available: config.useFunctionCallingIfAvailable,
    classification_choices: config.classificationChoices,
    direction: config.direction ?? undefined,
    data_granularity: config.dataGranularity,
    llm_config: {
      ai_integration_id: config.llmConfig.aiIntegrationId,
      model_name: config.llmConfig.modelName,
      invocation_parameters: config.llmConfig.invocationParameters,
      provider_parameters: config.llmConfig.providerParameters,
    },
  };
}

export function codeConfigToRaw(config: CodeConfig): RawCodeConfig {
  const base = {
    name: config.name,
    variables: config.variables,
    static_params: config.staticParams?.map(
      (p): RawStaticParam => ({
        name: p.name,
        type: p.type,
        default_value: p.defaultValue,
      }),
    ),
    data_granularity: config.dataGranularity,
    query_filter: config.queryFilter,
  };
  if (config.type === "MANAGED") {
    const raw: RawManagedCodeConfig = {
      ...base,
      type: "MANAGED",
      managed_evaluator: config.managedEvaluator,
    };
    return raw;
  }
  const raw: RawCustomCodeConfig = {
    ...base,
    type: "CUSTOM",
    code: config.code,
    imports: config.imports,
  };
  return raw;
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

function transformStaticParam(raw: RawStaticParam): StaticParam {
  switch (raw.type) {
    case "STRING_ARRAY":
      return {
        name: raw.name,
        type: "STRING_ARRAY",
        defaultValue: raw.default_value as string[],
      };
    case "STRING":
      return {
        name: raw.name,
        type: "STRING",
        defaultValue: raw.default_value as string,
      };
    case "REGEX":
      return {
        name: raw.name,
        type: "REGEX",
        defaultValue: raw.default_value as string,
      };
  }
}

function transformCodeConfig(raw: RawCodeConfig): CodeConfig {
  const staticParams = raw.static_params?.map(transformStaticParam);
  const base = {
    name: raw.name,
    variables: raw.variables,
    staticParams: staticParams?.length ? staticParams : undefined,
    dataGranularity: raw.data_granularity,
    queryFilter: raw.query_filter,
  };
  if (raw.type === "MANAGED") {
    const managed: ManagedCodeConfig = {
      ...base,
      type: "MANAGED",
      managedEvaluator: raw.managed_evaluator,
    };
    return managed;
  }
  return {
    ...base,
    type: "CUSTOM",
    code: raw.code,
    imports: raw.imports,
  };
}

export function transformEvaluatorVersion(
  raw: RawEvaluatorVersion,
): EvaluatorVersion {
  const base = {
    id: raw.id,
    evaluatorId: raw.evaluator_id,
    commitHash: raw.commit_hash,
    commitMessage: raw.commit_message,
    createdAt: new Date(raw.created_at),
    createdByUserId: raw.created_by_user_id,
  };

  switch (raw.type) {
    case "CODE":
      return {
        ...base,
        type: "CODE",
        codeConfig: transformCodeConfig(raw.code_config),
      };
    case "TEMPLATE":
      return {
        ...base,
        type: "TEMPLATE",
        templateConfig: transformTemplateConfig(raw.template_config),
      };
    // Harness and remote versions expose only common version metadata; their
    // configurations are not yet accessible via the REST API.
    case "HARNESS":
      return { ...base, type: "HARNESS" };
    case "REMOTE":
      return { ...base, type: "REMOTE" };
  }
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
