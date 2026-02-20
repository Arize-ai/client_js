import { describe, expect, it } from "vitest";
import {
  normalizeExperimentRun,
  transformExperiment,
  transformExperimentRun,
} from "../utils";
import { mockExperiment, mockExperimentRun } from "./fixtures";

describe("transformExperiment", () => {
  it("should transform the created_at and updated_at fields of an experiment to date objects", () => {
    const expectedResult = {
      id: mockExperiment.id,
      name: mockExperiment.name,
      datasetId: mockExperiment.dataset_id,
      datasetVersionId: mockExperiment.dataset_version_id,
      createdAt: new Date(mockExperiment.created_at),
      updatedAt: new Date(mockExperiment.updated_at),
    };
    const experiment = transformExperiment(mockExperiment);
    expect(experiment).toEqual(expectedResult);
  });
});

describe("normalizeExperimentRun", () => {
  it("supports legacy snake_case example_id input", () => {
    const normalizedRun = normalizeExperimentRun({
      example_id: mockExperimentRun.example_id,
      output: mockExperimentRun.output,
    });
    expect(normalizedRun).toEqual({
      example_id: mockExperimentRun.example_id,
      output: mockExperimentRun.output,
    });
  });

  it("supports camelCase exampleId input", () => {
    const normalizedRun = normalizeExperimentRun({
      exampleId: mockExperimentRun.example_id,
      output: mockExperimentRun.output,
    });
    expect(normalizedRun).toEqual({
      example_id: mockExperimentRun.example_id,
      output: mockExperimentRun.output,
    });
  });
});

describe("transformExperimentRun", () => {
  it("returns legacy example_id and camelCase exampleId", () => {
    const transformedRun = transformExperimentRun(mockExperimentRun);
    expect(transformedRun).toEqual({
      id: mockExperimentRun.id,
      output: mockExperimentRun.output,
      example_id: mockExperimentRun.example_id,
      exampleId: mockExperimentRun.example_id,
    });
  });
});
