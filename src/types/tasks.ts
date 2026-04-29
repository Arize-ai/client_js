import { RawTask, RawTaskRun } from "./internal";

export type TaskType = RawTask["type"];
export type TaskRunStatus = RawTaskRun["status"];

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
  lastRunAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string | null;
}

export interface TaskRun {
  id: string;
  taskId: string;
  status: TaskRunStatus;
  runStartedAt: Date | null;
  runFinishedAt: Date | null;
  dataStartTime: Date | null;
  dataEndTime: Date | null;
  /** Number of spans successfully evaluated during this run. */
  numSuccesses: number;
  /** Number of spans where the evaluator raised an error during this run. */
  numErrors: number;
  /**
   * Number of spans skipped during this run. Spans are skipped when they were
   * already evaluated in a previous run and `overrideEvaluations` is false.
   */
  numSkipped: number;
  createdAt: Date;
  createdByUserId: string | null;
}

export type CreateTaskEvaluatorInput = {
  evaluatorId: string;
  queryFilter?: string;
  columnMappings?: Record<string, string>;
};

/**
 * Input for creating a new evaluation task.
 *
 * Exactly one of `project` (for online project monitoring) or `dataset`
 * (for offline batch evaluation) must be provided — they are mutually exclusive.
 * `isContinuous` and `samplingRate` are only valid for project-scoped tasks.
 */
export type CreateTaskInput = {
  name: string;
  type: TaskType;
  /** The space name or ID. Required when `project` or `dataset` is a name. */
  space?: string;
  /** The project name or ID to monitor. Mutually exclusive with `dataset`. */
  project?: string;
  /** The dataset name or ID to evaluate. Mutually exclusive with `project`. */
  dataset?: string;
  /**
   * Experiment IDs to scope this task to. Only valid for dataset-scoped tasks
   * (`dataset` is set). When provided, the task evaluates only the specified
   * experiments rather than the entire dataset.
   */
  experimentIds?: string[];
  isContinuous?: boolean;
  samplingRate?: number;
  queryFilter?: string;
  evaluators: CreateTaskEvaluatorInput[];
};

export type TriggerTaskRunInput = {
  dataStartTime?: Date;
  dataEndTime?: Date;
  maxSpans?: number;
  overrideEvaluations?: boolean;
  /**
   * Experiment IDs to evaluate. Only valid for dataset-scoped tasks. When
   * provided, only spans belonging to these experiments are evaluated.
   */
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
  /**
   * When provided, replaces the entire evaluator list (requires at least one entry).
   */
  evaluators?: CreateTaskEvaluatorInput[];
};
