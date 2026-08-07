import { Annotation } from "./spans";

export type Experiment = {
  id: string;
  name: string;
  spaceId: string;
  datasetId?: string | null;
  datasetVersionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  experimentTracesProjectId?: string;
  /**
   * Identifier (base64) of the agent integration that backs this experiment.
   * Null/undefined for non-agent experiments (e.g. SDK or Playground experiments).
   */
  integrationId?: string | null;
};

export type ExperimentRunInput = {
  output: string;
  exampleId?: string;
} & {
  [key: string]: unknown;
};

export type ExperimentRun = {
  id: string;
  exampleId?: string | null;
  output?: string | null;
  error?: string | null;
  annotations?: Annotation[];
  [key: string]: unknown;
};
