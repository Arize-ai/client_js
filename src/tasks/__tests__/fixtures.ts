import { TaskRun } from "../../types";
import { RawTask, RawTaskEvaluator, RawTaskRun } from "../../types/internal";

export const mockDateString = "2026-03-01T10:00:00.000Z";
export const mockUpdatedDateString = "2026-03-02T12:00:00.000Z";
export const mockLastRunDateString = "2026-03-03T08:00:00.000Z";

export const mockTaskEvaluator: RawTaskEvaluator = {
  evaluator_id: "eval-123",
  evaluator_name: "My Evaluator",
  query_filter: "span_kind == 'LLM'",
  column_mappings: { input: "question", output: "answer" },
};

export const mockTask: RawTask = {
  id: "task-abc",
  name: "Weekly Quality Check",
  type: "template_evaluation",
  project_id: "proj-1",
  dataset_id: null,
  is_continuous: false,
  sampling_rate: 0.5,
  query_filter: null,
  evaluators: [mockTaskEvaluator],
  experiment_ids: [],
  last_run_at: mockLastRunDateString,
  created_at: mockDateString,
  updated_at: mockUpdatedDateString,
  created_by_user_id: "user-42",
};

export const mockTaskRun: RawTaskRun = {
  id: "run-xyz",
  task_id: "task-abc",
  status: "completed",
  run_started_at: mockDateString,
  run_finished_at: mockUpdatedDateString,
  data_start_time: "2026-02-28T00:00:00.000Z",
  data_end_time: "2026-03-01T00:00:00.000Z",
  num_successes: 100,
  num_errors: 2,
  num_skipped: 5,
  created_at: mockDateString,
  created_by_user_id: "user-42",
};

const mockTaskRunBase: TaskRun = {
  id: "run-1",
  taskId: "task-1",
  status: "pending",
  runStartedAt: null,
  runFinishedAt: null,
  dataStartTime: null,
  dataEndTime: null,
  numSuccesses: 0,
  numErrors: 0,
  numSkipped: 0,
  createdAt: new Date("2026-03-01T00:00:00Z"),
  createdByUserId: null,
};

export function makeRun(config?: Partial<TaskRun>): TaskRun {
  return Object.assign({}, mockTaskRunBase, config);
}
