import {
  CreateTaskEvaluatorInput,
  Task,
  TaskEvaluator,
  TaskRun,
} from "../types";
import { RawTask, RawTaskEvaluator, RawTaskRun } from "../types/internal";

/**
 * Converts a CreateTaskEvaluatorInput to a raw task evaluator.
 *
 * @param evaluator - The CreateTaskEvaluatorInput to convert.
 * @returns The raw task evaluator.
 */
export function toRawTaskEvaluator(evaluator: CreateTaskEvaluatorInput): {
  evaluator_id: string;
  query_filter?: string;
  column_mappings?: Record<string, string>;
} {
  return {
    evaluator_id: evaluator.evaluatorId,
    query_filter: evaluator.queryFilter,
    column_mappings: evaluator.columnMappings,
  };
}

/**
 * Transforms a raw task evaluator to a TaskEvaluator object.
 *
 * @param evaluator - The raw task evaluator to transform.
 * @returns The transformed TaskEvaluator object.
 */
export function transformTaskEvaluator(
  evaluator: RawTaskEvaluator,
): TaskEvaluator {
  return {
    evaluatorId: evaluator.evaluator_id,
    evaluatorName: evaluator.evaluator_name,
    queryFilter: evaluator.query_filter,
    columnMappings: evaluator.column_mappings,
  };
}

/**
 * Transforms a raw task to a Task object.
 *
 * @param task - The raw task to transform.
 * @returns The transformed Task object.
 */
export function transformTask(task: RawTask): Task {
  const { id, name, type } = task;
  return {
    id,
    name,
    type,
    projectId: task.project_id ?? null,
    datasetId: task.dataset_id ?? null,
    isContinuous: task.is_continuous,
    samplingRate: task.sampling_rate ?? null,
    queryFilter: task.query_filter,
    evaluators: task.evaluators.map(transformTaskEvaluator),
    experimentIds: task.experiment_ids,
    lastRunAt: task.last_run_at ? new Date(task.last_run_at) : null,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
    createdByUserId: task.created_by_user_id,
  };
}

/**
 * Transforms a raw task run to a TaskRun object.
 *
 * @param run - The raw task run to transform.
 * @returns The transformed TaskRun object.
 */
export function transformTaskRun(run: RawTaskRun): TaskRun {
  return {
    id: run.id,
    taskId: run.task_id,
    status: run.status,
    runStartedAt: run.run_started_at ? new Date(run.run_started_at) : null,
    runFinishedAt: run.run_finished_at ? new Date(run.run_finished_at) : null,
    dataStartTime: run.data_start_time ? new Date(run.data_start_time) : null,
    dataEndTime: run.data_end_time ? new Date(run.data_end_time) : null,
    numSuccesses: run.num_successes,
    numErrors: run.num_errors,
    numSkipped: run.num_skipped,
    createdAt: new Date(run.created_at),
    createdByUserId: run.created_by_user_id,
  };
}
