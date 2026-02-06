import { components } from "../__generated__/api/v2";

export type RawDataset = components["schemas"]["Dataset"];
export type RawDatasetVersion = components["schemas"]["DatasetVersion"];
export type RawExperiment = components["schemas"]["Experiment"];
export type RawExperimentRun = components["schemas"]["ExperimentRun"];
export type RawDatasetExample = components["schemas"]["DatasetExample"];
export type RawProject = components["schemas"]["Project"];
export type RawPaginationMetadata = components["schemas"]["PaginationMetadata"];
export type RawListExamplesResponse =
  components["responses"]["DatasetExampleList"]["content"]["application/json"];
export type RawCreateDatasetRequestBodyExample =
  components["requestBodies"]["CreateDatasetRequestBody"]["content"]["application/json"]["examples"][number];
export type RawUpdateDatasetRequestBodyExample =
  components["requestBodies"]["UpdateDatasetExamplesRequestBody"]["content"]["application/json"]["examples"][number];
