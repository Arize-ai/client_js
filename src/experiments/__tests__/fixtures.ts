import { RawExperiment, RawExperimentRun } from "../../types/internal";

const mockDateString = "2021-01-01T00:00:00.000Z";

export const mockExperiment: RawExperiment = {
  id: "experiment_id",
  name: "test-experiment",
  space_id: "space_id",
  dataset_id: "dataset_id",
  created_at: mockDateString,
  updated_at: mockDateString,
  dataset_version_id: "dataset_version_id",
};

export const mockAgentExperiment: RawExperiment = {
  id: "agent_experiment_id",
  name: "test-agent-experiment",
  dataset_id: "dataset_id",
  created_at: mockDateString,
  updated_at: mockDateString,
  dataset_version_id: "dataset_version_id",
  integration_id: "QWdlbnRJbnRlZ3JhdGlvbjoxMjphQmNE",
};

export const mockExperimentRun: RawExperimentRun = {
  id: "run_id",
  example_id: "example_id",
  output: "run_output",
};

export const mockExperimentRunWithAnnotations: RawExperimentRun = {
  id: "run_id",
  example_id: "example_id",
  output: "run_output",
  annotations: [
    {
      name: "quality",
      score: 0.9,
      label: "good",
      text: "spot on",
      updated_at: mockDateString,
      annotator: { id: "user-1", email: "u1@example.com" },
    },
  ],
};
