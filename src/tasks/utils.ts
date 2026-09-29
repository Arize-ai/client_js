import {
  CreateTaskEvaluatorInput,
  SpanEvaluatorInput,
  Task,
  TaskEvaluator,
  TaskQueryFilter,
  TaskRun,
  TraceOrSessionEvaluatorInput,
} from "../types";
import { components } from "../__generated__/api/v2";
import { RawTask, RawTaskEvaluator, RawTaskRun } from "../types/internal";

type RawTaskQueryFilterInput = components["schemas"]["TaskQueryFilterInput"];
type RawTaskQueryMapping = components["schemas"]["TaskQueryMapping"];

/**
 * Converts a list of TaskQueryFilter entries to the raw TaskQueryFilterInput
 * shape used in create/update request bodies.
 *
 * @param filters - Named query filters to convert.
 * @returns The raw filter input array.
 */
export function toRawQueryFilters(
  filters: TaskQueryFilter[],
): RawTaskQueryFilterInput[] {
  return filters.map(({ id, filter }) => ({ id, filter }));
}

/**
 * Converts a CreateTaskEvaluatorInput to a raw task evaluator input shape.
 * When `queryMappings` is present the evaluator is sent as a
 * TraceOrSessionEvaluatorInput; otherwise it is sent as a SpanEvaluatorInput.
 *
 * `CreateTaskEvaluatorInput` is a discriminated union at the type level, but
 * an untyped JS caller can still pass an object carrying fields from both
 * shapes (e.g. `queryMappings` alongside `queryFilter`/`columnMappings`).
 * Throw in that case instead of silently dropping the span fields — matching
 * the mutually-exclusive guard `createTask`/`updateTask` apply at the
 * task level.
 *
 * @param evaluator - The CreateTaskEvaluatorInput to convert.
 * @returns The raw evaluator payload.
 */
export function toRawTaskEvaluator(evaluator: CreateTaskEvaluatorInput): {
  evaluator_id: string;
  evaluator_version_id?: string | null;
  query_filter?: string;
  column_mappings?: Record<string, string>;
  query_mappings?: RawTaskQueryMapping[];
} {
  const maybeBoth = evaluator as Partial<SpanEvaluatorInput> &
    Partial<TraceOrSessionEvaluatorInput>;
  const hasQueryMappings = maybeBoth.queryMappings != null;
  const hasSpanFields =
    maybeBoth.queryFilter != null || maybeBoth.columnMappings != null;

  if (hasQueryMappings && hasSpanFields) {
    throw new Error(
      "queryMappings and queryFilter/columnMappings are mutually exclusive on a single evaluator; provide one shape or the other.",
    );
  }

  if (hasQueryMappings) {
    return {
      evaluator_id: evaluator.evaluatorId,
      evaluator_version_id: evaluator.evaluatorVersionId,
      query_mappings: maybeBoth.queryMappings!.map(
        ({ variableName, queryIds, attributePath }) => ({
          variable_name: variableName,
          query_ids: queryIds,
          attribute_path: attributePath,
        }),
      ),
    };
  }
  return {
    evaluator_id: evaluator.evaluatorId,
    evaluator_version_id: evaluator.evaluatorVersionId,
    query_filter: maybeBoth.queryFilter,
    column_mappings: maybeBoth.columnMappings,
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
    evaluatorVersionId: evaluator.evaluator_version_id,
    queryFilter: evaluator.query_filter,
    columnMappings: evaluator.column_mappings,
    queryMappings:
      evaluator.query_mappings?.map(
        ({ variable_name, query_ids, attribute_path }) => ({
          variableName: variable_name,
          queryIds: query_ids,
          attributePath: attribute_path,
        }),
      ) ?? null,
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
    queryFilters: task.query_filters ?? null,
    evaluators: task.evaluators.map(transformTaskEvaluator),
    experimentIds: task.experiment_ids,
    runConfiguration: task.run_configuration ?? null,
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
    experimentId: run.experiment_id ?? null,
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
