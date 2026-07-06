import { Annotation } from "./spans";
import { PaginationMetadata } from "./pagination";

export type Experiment = {
  id: string;
  name: string;
  datasetId: string;
  datasetVersionId: string;
  createdAt: Date;
  updatedAt: Date;
  experimentTracesProjectId?: string;
};

export type ExperimentRunInput = {
  output: string;
} & (
  | {
      exampleId: string;
      /** @deprecated Use `exampleId` instead. */
      example_id?: string;
    }
  | {
      /** @deprecated Use `exampleId` instead. */
      example_id: string;
      exampleId?: string;
    }
) & {
    [key: string]: unknown;
  };

export type ExperimentRun = {
  id: string;
  /** @deprecated Use `exampleId` instead. */
  example_id: string;
  exampleId?: string;
  output?: string | null;
  error?: string | null;
  annotations?: Annotation[];
  [key: string]: unknown;
};

export type ExperimentRunsListResponse = {
  experiment_runs: ExperimentRun[];
  pagination: PaginationMetadata;
};
