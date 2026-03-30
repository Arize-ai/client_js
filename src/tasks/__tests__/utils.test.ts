import { describe, expect, it } from "vitest";
import {
  toRawTaskEvaluator,
  transformTask,
  transformTaskEvaluator,
  transformTaskRun,
} from "../utils";
import {
  mockDateString,
  mockLastRunDateString,
  mockTask,
  mockTaskEvaluator,
  mockTaskRun,
  mockUpdatedDateString,
} from "./fixtures";

describe("transformTaskEvaluator", () => {
  it("should map snake_case fields to camelCase", () => {
    const result = transformTaskEvaluator(mockTaskEvaluator);
    expect(result.evaluatorId).toBe(mockTaskEvaluator.evaluator_id);
    expect(result.evaluatorName).toBe(mockTaskEvaluator.evaluator_name);
    expect(result.queryFilter).toBe(mockTaskEvaluator.query_filter);
    expect(result.columnMappings).toEqual(mockTaskEvaluator.column_mappings);
  });

  it("should pass through null queryFilter and columnMappings", () => {
    const result = transformTaskEvaluator({
      ...mockTaskEvaluator,
      query_filter: null,
      column_mappings: null,
    });
    expect(result.queryFilter).toBeNull();
    expect(result.columnMappings).toBeNull();
  });
});

describe("transformTask", () => {
  it("should convert date strings to Date objects", () => {
    const result = transformTask(mockTask);
    expect(result.createdAt).toEqual(new Date(mockDateString));
    expect(result.updatedAt).toEqual(new Date(mockUpdatedDateString));
    expect(result.lastRunAt).toEqual(new Date(mockLastRunDateString));
  });

  it("should map snake_case fields to camelCase", () => {
    const result = transformTask(mockTask);
    expect(result.id).toBe(mockTask.id);
    expect(result.name).toBe(mockTask.name);
    expect(result.type).toBe(mockTask.type);
    expect(result.projectId).toBe(mockTask.project_id);
    expect(result.datasetId).toBe(mockTask.dataset_id);
    expect(result.isContinuous).toBe(mockTask.is_continuous);
    expect(result.samplingRate).toBe(mockTask.sampling_rate);
    expect(result.queryFilter).toBe(mockTask.query_filter);
    expect(result.experimentIds).toEqual(mockTask.experiment_ids);
    expect(result.createdByUserId).toBe(mockTask.created_by_user_id);
  });

  it("should transform nested evaluators", () => {
    const result = transformTask(mockTask);
    expect(result.evaluators).toHaveLength(1);

    expect(result.evaluators[0]!.evaluatorId).toBe(
      mockTask.evaluators[0]!.evaluator_id,
    );
  });

  it("should return null for lastRunAt when not set", () => {
    const result = transformTask({ ...mockTask, last_run_at: null });
    expect(result.lastRunAt).toBeNull();
  });

  it("should return null for samplingRate when not set", () => {
    const result = transformTask({ ...mockTask, sampling_rate: null });
    expect(result.samplingRate).toBeNull();
  });
});

describe("transformTaskRun", () => {
  it("should convert date strings to Date objects", () => {
    const result = transformTaskRun(mockTaskRun);
    expect(result.createdAt).toEqual(new Date(mockTaskRun.created_at));
    expect(result.runStartedAt).toEqual(new Date(mockTaskRun.run_started_at!));
    expect(result.runFinishedAt).toEqual(
      new Date(mockTaskRun.run_finished_at!),
    );
    expect(result.dataStartTime).toEqual(
      new Date(mockTaskRun.data_start_time!),
    );
    expect(result.dataEndTime).toEqual(new Date(mockTaskRun.data_end_time!));
  });

  it("should map snake_case fields to camelCase", () => {
    const result = transformTaskRun(mockTaskRun);
    expect(result.id).toBe(mockTaskRun.id);
    expect(result.taskId).toBe(mockTaskRun.task_id);
    expect(result.status).toBe(mockTaskRun.status);
    expect(result.numSuccesses).toBe(mockTaskRun.num_successes);
    expect(result.numErrors).toBe(mockTaskRun.num_errors);
    expect(result.numSkipped).toBe(mockTaskRun.num_skipped);
    expect(result.createdByUserId).toBe(mockTaskRun.created_by_user_id);
  });

  it("should return null for optional date fields when not set", () => {
    const result = transformTaskRun({
      ...mockTaskRun,
      run_started_at: null,
      run_finished_at: null,
      data_start_time: null,
      data_end_time: null,
    });
    expect(result.runStartedAt).toBeNull();
    expect(result.runFinishedAt).toBeNull();
    expect(result.dataStartTime).toBeNull();
    expect(result.dataEndTime).toBeNull();
  });
});

describe("toRawTaskEvaluator", () => {
  it("should map camelCase fields to snake_case", () => {
    const input = {
      evaluatorId: "eval-123",
      queryFilter: "span_kind == 'LLM'",
      columnMappings: { input: "question", output: "answer" },
    };
    expect(toRawTaskEvaluator(input)).toEqual({
      evaluator_id: "eval-123",
      query_filter: "span_kind == 'LLM'",
      column_mappings: { input: "question", output: "answer" },
    });
  });

  it("should pass through undefined optional fields", () => {
    const result = toRawTaskEvaluator({ evaluatorId: "eval-456" });
    expect(result.evaluator_id).toBe("eval-456");
    expect(result.query_filter).toBeUndefined();
    expect(result.column_mappings).toBeUndefined();
  });
});
