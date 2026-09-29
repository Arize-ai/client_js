import { components } from "../__generated__/api/v2";
import { RawTask, RawTaskRun } from "./internal";

export type TaskType = RawTask["type"];
export type TaskRunStatus = RawTaskRun["status"];

/**
 * A named query filter entry used in the trace/session (multi-query) shape.
 * The `id` is a single letter (`A`-`E`) referenced by `expression` and
 * per-evaluator `queryMappings`.
 */
export type TaskQueryFilter = components["schemas"]["TaskQueryFilter"];

/**
 * Combined named-query filters and boolean expression for the trace/session
 * shape.
 */
export type TaskQueryFilters = components["schemas"]["TaskQueryFilters"];

/**
 * Maps one evaluator template variable to one or more named query ids plus an
 * attribute path, for trace/session-granularity evaluators.
 */
export type TaskQueryMapping = {
  variableName: string;
  queryIds: string[];
  attributePath: string;
};

// ---- Run-experiment config input types ----

/**
 * LLM-generation experiment configuration. Extends the generated schema with
 * an optional `aiIntegration` name field: when set, the SDK resolves it to an
 * AI integration ID before sending the request.
 */
export type LlmGenerationConfigInput =
  components["schemas"]["LlmGenerationRunConfigRequest"] & {
    /**
     * Optional: resolve the AI integration by name instead of by ID.
     * When set, the SDK looks up the integration ID and overwrites
     * `ai_integration_id` before sending the request.
     */
    aiIntegration?: string;
  };

/**
 * Template-evaluation experiment configuration. Extends the generated schema
 * with an optional `aiIntegration` name field.
 */
export type TemplateEvaluationConfigInput =
  components["schemas"]["TemplateEvaluationRunConfigRequest"] & {
    /** Optional: resolve aiIntegration by name instead of ID. */
    aiIntegration?: string;
  };

/**
 * Agent-call experiment configuration. Extends the generated schema with an
 * optional `integration` name field: when set, the SDK resolves it to an AGENT
 * integration ID before sending the request.
 */
export type AgentCallConfigInput =
  components["schemas"]["AgentCallRunConfig"] & {
    /**
     * Optional: resolve the AGENT integration by name instead of by ID.
     * When set, the SDK looks up the integration ID and overwrites
     * `integration_id` before sending the request.
     */
    integration?: string;
  };

/**
 * Discriminated run configuration — LLM generation, template evaluation, or
 * agent call.
 */
export type RunExperimentConfigInput =
  | LlmGenerationConfigInput
  | TemplateEvaluationConfigInput
  | AgentCallConfigInput;

// ---- Create-task input types ----

/** Evaluator input for span-granularity evaluators. Mutually exclusive with {@link TraceOrSessionEvaluatorInput}. */
export type SpanEvaluatorInput = {
  evaluatorId: string;
  /**
   * Pins this evaluator to one version. Omit it, or pass null, to run the
   * evaluator's latest version. Must be a version of `evaluatorId`.
   */
  evaluatorVersionId?: string | null;
  queryFilter?: string;
  columnMappings?: Record<string, string>;
};

/** Evaluator input for trace/session-granularity evaluators. Mutually exclusive with {@link SpanEvaluatorInput}. */
export type TraceOrSessionEvaluatorInput = {
  evaluatorId: string;
  /**
   * Pins this evaluator to one version. Omit it, or pass null, to run the
   * evaluator's latest version. Must be a version of `evaluatorId`.
   */
  evaluatorVersionId?: string | null;
  queryMappings: TaskQueryMapping[];
};

/**
 * Per-evaluator input. Discriminated union — supply either span fields
 * ({@link SpanEvaluatorInput}) or trace/session fields
 * ({@link TraceOrSessionEvaluatorInput}), not both.
 */
export type CreateTaskEvaluatorInput =
  | SpanEvaluatorInput
  | TraceOrSessionEvaluatorInput;

/**
 * Input for creating a new evaluation task (`TEMPLATE_EVALUATION` or
 * `CODE_EVALUATION`).
 *
 * Exactly one of `project` (for online project monitoring) or `dataset`
 * (for offline batch evaluation) must be provided.
 * `isContinuous` and `samplingRate` are only valid for project-scoped tasks.
 */
export type CreateEvaluationTaskInput = {
  name: string;
  type: "TEMPLATE_EVALUATION" | "CODE_EVALUATION";
  /** The space name or ID. Required when `project` or `dataset` is a name. */
  space?: string;
  /** The project name or ID to monitor. Mutually exclusive with `dataset`. */
  project?: string;
  /** The dataset name or ID to evaluate. Mutually exclusive with `project`. */
  dataset?: string;
  /**
   * Experiment IDs to scope this task to. Only valid for dataset-scoped tasks.
   */
  experimentIds?: string[];
  isContinuous?: boolean;
  samplingRate?: number;
  /**
   * Task-level query filter (span shape). Mutually exclusive with `queryFilters`.
   */
  queryFilter?: string;
  /**
   * Combined named query filters and boolean expression for trace/session-granularity
   * evaluators (1–5 filters with unique `A`–`E` ids). Mutually exclusive with `queryFilter`.
   */
  queryFilters?: TaskQueryFilters;
  evaluators: CreateTaskEvaluatorInput[];
};

/**
 * Input for creating a new `RUN_EXPERIMENT` task (server-side LLM experiment).
 *
 * Use {@link createRunExperimentTask} for name-based AI integration resolution,
 * or pass `ai_integration_id` directly in `runConfiguration`.
 */
export type CreateRunExperimentTaskInput = {
  name: string;
  type: "RUN_EXPERIMENT";
  /** The space name or ID. Required when `dataset` is a name. */
  space?: string;
  /** The dataset name or ID to run the experiment against. */
  dataset: string;
  /** Discriminated experiment configuration. */
  runConfiguration: RunExperimentConfigInput;
};

/**
 * Generic create-task input. Discriminated by `type`:
 * - `"TEMPLATE_EVALUATION"` | `"CODE_EVALUATION"` → {@link CreateEvaluationTaskInput}
 * - `"RUN_EXPERIMENT"` → {@link CreateRunExperimentTaskInput}
 *
 * Prefer the narrow helpers {@link createEvaluationTask} and
 * {@link createRunExperimentTask} for clearer signatures.
 */
export type CreateTaskInput =
  | CreateEvaluationTaskInput
  | CreateRunExperimentTaskInput;

// ---- Shared task types ----

export interface TaskEvaluator {
  evaluatorId: string;
  evaluatorName: string;
  /** The pinned version, or null when the evaluator runs its latest version. */
  evaluatorVersionId: string | null;
  /** Per-evaluator query filter (span shape). Null for trace/session evaluators. */
  queryFilter: string | null;
  /** Column mappings (span shape). Null for trace/session evaluators. */
  columnMappings: Record<string, string> | null;
  /**
   * Per-evaluator variable-to-query mappings (trace/session shape).
   * Null for span evaluators.
   */
  queryMappings: TaskQueryMapping[] | null;
}

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  projectId: string | null;
  datasetId: string | null;
  isContinuous: boolean;
  samplingRate: number | null;
  /** Task-level query filter (span shape). Null for trace/session tasks. */
  queryFilter: string | null;
  /**
   * Task-level named query filters plus optional boolean expression for
   * trace/session tasks. Null for span tasks.
   */
  queryFilters: TaskQueryFilters | null;
  evaluators: TaskEvaluator[];
  experimentIds: string[];
  /**
   * Run configuration for `RUN_EXPERIMENT` tasks. `null` for all other task
   * types.
   */
  runConfiguration: RawTask["run_configuration"] | null;
  lastRunAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string | null;
}

export interface TaskRun {
  id: string;
  taskId: string;
  status: TaskRunStatus;
  /**
   * Created experiment global ID (base64). Populated only for `RUN_EXPERIMENT`
   * task runs after the experiment has been provisioned. `null` for all other
   * task types and while provisioning is in progress.
   */
  experimentId: string | null;
  runStartedAt: Date | null;
  runFinishedAt: Date | null;
  dataStartTime: Date | null;
  dataEndTime: Date | null;
  numSuccesses: number;
  numErrors: number;
  numSkipped: number;
  createdAt: Date;
  createdByUserId: string | null;
}

export type TriggerTaskRunInput = {
  dataStartTime?: Date;
  dataEndTime?: Date;
  maxSpans?: number;
  overrideEvaluations?: boolean;
  experimentIds?: string[];
};

/**
 * Input for updating an existing task. At least one field should be set.
 * `samplingRate` and `isContinuous` apply to project-based tasks only.
 * Pass `queryFilter: null` to clear the task-level filter.
 */
export type UpdateTaskInput = {
  name?: string;
  samplingRate?: number;
  isContinuous?: boolean;
  /** Task-level query filter (span shape). Pass `null` to clear. Mutually exclusive with `queryFilters`. */
  queryFilter?: string | null;
  /**
   * Combined named query filters and boolean expression for trace/session-granularity
   * evaluators. Pass `null` to clear. Mutually exclusive with `queryFilter`.
   */
  queryFilters?: TaskQueryFilters | null;
  evaluators?: CreateTaskEvaluatorInput[];
};
