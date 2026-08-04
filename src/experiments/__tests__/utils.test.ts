import { describe, expect, it } from "vitest";
import {
  normalizeExperimentRun,
  transformExperiment,
  transformExperimentRun,
} from "../utils";
import {
  mockExperiment,
  mockExperimentRun,
  mockExperimentRunWithAnnotations,
} from "./fixtures";

describe("transformExperiment", () => {
  it("should transform the created_at and updated_at fields of an experiment to date objects", () => {
    const expectedResult = {
      id: mockExperiment.id,
      name: mockExperiment.name,
      spaceId: mockExperiment.space_id,
      datasetId: mockExperiment.dataset_id,
      datasetVersionId: mockExperiment.dataset_version_id,
      createdAt: new Date(mockExperiment.created_at),
      updatedAt: new Date(mockExperiment.updated_at),
    };
    const experiment = transformExperiment(mockExperiment);
    expect(experiment).toEqual(expectedResult);
  });

  it("should pass through null datasetId and datasetVersionId for experiments without a dataset", () => {
    const experiment = transformExperiment({
      ...mockExperiment,
      dataset_id: null,
      dataset_version_id: null,
    });
    expect(experiment.datasetId).toBeNull();
    expect(experiment.datasetVersionId).toBeNull();
  });
});

describe("normalizeExperimentRun", () => {
  it("maps camelCase exampleId onto the wire example_id", () => {
    const normalizedRun = normalizeExperimentRun({
      exampleId: mockExperimentRun.example_id,
      output: "run_output",
    });
    expect(normalizedRun).toEqual({
      example_id: mockExperimentRun.example_id,
      output: "run_output",
    });
  });

  it("omits example_id for a standalone run with no example ID", () => {
    const normalizedRun = normalizeExperimentRun({
      output: "run_output",
    });
    expect(normalizedRun).toEqual({ output: "run_output" });
    expect(normalizedRun).not.toHaveProperty("example_id");
  });
});

describe("transformExperimentRun", () => {
  it("maps the wire example_id onto camelCase exampleId", () => {
    const transformedRun = transformExperimentRun(mockExperimentRun);
    expect(transformedRun).toEqual({
      id: mockExperimentRun.id,
      output: mockExperimentRun.output,
      exampleId: mockExperimentRun.example_id,
    });
  });

  it("omits the annotations key when annotations are absent", () => {
    const transformedRun = transformExperimentRun(mockExperimentRun);
    expect(transformedRun).not.toHaveProperty("annotations");
  });

  it("transforms populated annotations and maps updated_at to a Date", () => {
    const transformedRun = transformExperimentRun(
      mockExperimentRunWithAnnotations,
    );
    expect(transformedRun.annotations).toEqual([
      {
        name: "quality",
        score: 0.9,
        label: "good",
        text: "spot on",
        updatedAt: new Date(
          mockExperimentRunWithAnnotations.annotations?.[0]?.updated_at ?? "",
        ),
        annotator: { id: "user-1", email: "u1@example.com" },
      },
    ]);
  });
});
