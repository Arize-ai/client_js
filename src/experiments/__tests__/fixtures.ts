import { RawExperiment, RawExperimentRun } from "../../types/internal";

const mockDateString = "2021-01-01T00:00:00.000Z";

export const mockExperiment: RawExperiment = {
  id: "experiment_id",
  name: "test-experiment",
  dataset_id: "dataset_id",
  created_at: mockDateString,
  updated_at: mockDateString,
  dataset_version_id: "dataset_version_id",
};

export const mockExperimentRun: RawExperimentRun = {
  id: "run_id",
  example_id: "example_id",
  output: "run_output",
};
