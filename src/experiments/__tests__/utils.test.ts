import { describe, expect, it } from "vitest";
import { transformExperiment } from "../utils";
import { mockExperiment } from "./fixtures";

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
