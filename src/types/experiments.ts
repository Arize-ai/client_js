import { components } from "../__generated__/api/v2";

export type Experiment = {
  id: string;
  name: string;
  datasetId: string;
  datasetVersionId: string;
  createdAt: Date;
  updatedAt: Date;
  experimentTracesProjectId?: string;
};

export type ExperimentRunInput =
  components["requestBodies"]["CreateExperimentRequestBody"]["content"]["application/json"]["experiment_runs"][number];

export type ExperimentRun = components["schemas"]["ExperimentRun"];
