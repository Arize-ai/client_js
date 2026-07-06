import type { components } from "../__generated__/api/v2";

export type EvaluatorType = "template" | "code" | "harness" | "remote";

export type EvaluatorDirection = components["schemas"]["OptimizationDirection"];

export type EvaluatorDataGranularity = "span" | "trace" | "session";

export type ManagedCodeEvaluator =
  components["schemas"]["ManagedCodeEvaluator"];

export type StaticParam =
  | { name: string; type: "STRING"; defaultValue: string }
  | { name: string; type: "STRING_ARRAY"; defaultValue: string[] }
  | { name: string; type: "REGEX"; defaultValue: string };

export interface EvaluatorLlmConfig {
  aiIntegrationId: string;
  modelName: string;
  invocationParameters: Record<string, unknown>;
  providerParameters: Record<string, unknown>;
}

export interface TemplateConfig {
  name: string;
  template: string;
  includeExplanations: boolean;
  useFunctionCallingIfAvailable: boolean;
  classificationChoices?: Record<string, number> | null;
  direction?: EvaluatorDirection | null;
  dataGranularity?: EvaluatorDataGranularity | null;
  llmConfig: EvaluatorLlmConfig;
}

export interface ManagedCodeConfig {
  type: "managed";
  name: string;
  managedEvaluator: ManagedCodeEvaluator;
  variables: string[];
  staticParams?: StaticParam[];
  dataGranularity?: EvaluatorDataGranularity | null;
  queryFilter?: string | null;
}

export interface CustomCodeConfig {
  type: "custom";
  name: string;
  code: string;
  imports?: string | null;
  variables: string[];
  staticParams?: StaticParam[];
  dataGranularity?: EvaluatorDataGranularity | null;
  queryFilter?: string | null;
}

export type CodeConfig = ManagedCodeConfig | CustomCodeConfig;

export interface Evaluator {
  id: string;
  name: string;
  description?: string | null;
  type: EvaluatorType;
  spaceId: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string | null;
}

/** Common fields shared by all evaluator versions. */
interface EvaluatorVersionBase {
  id: string;
  evaluatorId: string;
  commitHash: string;
  /** Null for evaluators migrated from before commit messages were tracked. */
  commitMessage: string | null;
  createdAt: Date;
  createdByUserId: string | null;
}

export interface EvaluatorVersionTemplate extends EvaluatorVersionBase {
  type: "template";
  templateConfig: TemplateConfig;
}

export interface EvaluatorVersionCode extends EvaluatorVersionBase {
  type: "code";
  codeConfig: CodeConfig;
}

/**
 * Harness and remote versions expose only common version metadata; their
 * configurations are not yet accessible via the REST API.
 */
export interface EvaluatorVersionHarness extends EvaluatorVersionBase {
  type: "harness";
}

export interface EvaluatorVersionRemote extends EvaluatorVersionBase {
  type: "remote";
}

export type EvaluatorVersion =
  | EvaluatorVersionTemplate
  | EvaluatorVersionCode
  | EvaluatorVersionHarness
  | EvaluatorVersionRemote;

export interface EvaluatorWithVersion extends Evaluator {
  version: EvaluatorVersion;
}

export type CreateTemplateEvaluatorInput = {
  name: string;
  description?: string;
  space: string;
  commitMessage: string;
  templateConfig: TemplateConfig;
};

export type CreateCodeEvaluatorInput = {
  name: string;
  description?: string;
  space: string;
  commitMessage: string;
  codeConfig: CodeConfig;
};

export type UpdateEvaluatorInput =
  | { name: string; description?: string }
  | { name?: string; description: string };

export type CreateTemplateEvaluatorVersionInput = {
  evaluator: string;
  space?: string;
  commitMessage: string;
  templateConfig: TemplateConfig;
};

export type CreateCodeEvaluatorVersionInput = {
  evaluator: string;
  space?: string;
  commitMessage: string;
  codeConfig: CodeConfig;
};
