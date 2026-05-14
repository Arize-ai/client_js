import { components } from "../__generated__/api/v2";
import { RawTask, RawTaskRun } from "./internal";

export type TaskType = RawTask["type"];
export type TaskRunStatus = RawTaskRun["status"];

// ---- Run-experiment config input types ----

/**
 * LLM-generation experiment configuration. Extends the generated schema with
 * an optional `aiIntegration` name field: when set, the SDK resolves it to an
 * AI integration ID before sending the request.
 */
export type LlmGenerationConfigInput =
  components["schemas"]["LlmGenerationRunConfig"] & {
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
  components["schemas"]["TemplateEvaluationRunConfig"] & {
    /** Optional: resolve aiIntegration by name instead of ID. */
    aiIntegration?: string;
  };

/** Discriminated run configuration — either LLM generation or template evaluation. */
export type RunExperimentConfigInput =
  | LlmGenerationConfigInput
  | TemplateEvaluationConfigInput;

// ---- Create-task input types ----

export type CreateTaskEvaluatorInput = {
  evaluatorId: string;
  queryFilter?: string;
  columnMappings?: Record<string, string>;
};

/**
 * Input for creating a new evaluation task (`template_evaluation` or
 * `code_evaluation`).
 *
 * Exactly one of `project` (for online project monitoring) or `dataset`
 * (for offline batch evaluation) must be provided.
 * `isContinuous` and `samplingRate` are only valid for project-scoped tasks.
 */
export type CreateEvaluationTaskInput = {
  name: string;
  type: "template_evaluation" | "code_evaluation";
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
  queryFilter?: string;
  evaluators: CreateTaskEvaluatorInput[];
};

/**
 * Input for creating a new `run_experiment` task (server-side LLM experiment).
 *
 * Use {@link createRunExperimentTask} for name-based AI integration resolution,
 * or pass `ai_integration_id` directly in `runConfiguration`.
 */
export type CreateRunExperimentTaskInput = {
  name: string;
  type: "run_experiment";
  /** The space name or ID. Required when `dataset` is a name. */
  space?: string;
  /** The dataset name or ID to run the experiment against. */
  dataset: string;
  /** Discriminated experiment configuration. */
  runConfiguration: RunExperimentConfigInput;
};

/**
 * Generic create-task input. Discriminated by `type`:
 * - `"template_evaluation"` | `"code_evaluation"` → {@link CreateEvaluationTaskInput}
 * - `"run_experiment"` → {@link CreateRunExperimentTaskInput}
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
  queryFilter: string | null;
  columnMappings: Record<string, string> | null;
}

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  projectId: string | null;
  datasetId: string | null;
  isContinuous: boolean;
  samplingRate: number | null;
  queryFilter: string | null;
  evaluators: TaskEvaluator[];
  experimentIds: string[];
  /**
   * Run configuration for `run_experiment` tasks. `null` for all other task
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
   * Created experiment global ID (base64). Populated only for `run_experiment`
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
  queryFilter?: string | null;
  evaluators?: CreateTaskEvaluatorInput[];
};
