/**
 * Evaluator type returned by the API.
 * Note: "code" evaluators may appear in list/get responses but cannot be
 * created via the SDK in this iteration — only "template" is supported.
 */
import type { components } from "../__generated__/api/v2";

export type EvaluatorType = "template" | "code";

export type EvaluatorDirection = components["schemas"]["OptimizationDirection"];

export type EvaluatorDataGranularity = "span" | "trace" | "session";

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

export interface EvaluatorWithVersion extends Evaluator {
  version: EvaluatorVersion;
}

export interface EvaluatorVersion {
  id: string;
  evaluatorId: string;
  commitHash: string;
  /** Null for evaluators migrated from before commit messages were tracked. */
  commitMessage: string | null;
  templateConfig: TemplateConfig;
  createdAt: Date;
  createdByUserId: string | null;
}

export interface CreateEvaluatorInput {
  name: string;
  description?: string;
  space: string;
  /** Only "template" is supported in this iteration. */
  type: "template";
  version: {
    commitMessage: string;
    templateConfig: TemplateConfig;
  };
}

export type UpdateEvaluatorInput =
  | { name: string; description?: string }
  | { name?: string; description: string };

export interface CreateEvaluatorVersionInput {
  evaluator: string;
  space?: string;
  commitMessage: string;
  templateConfig: TemplateConfig;
}
