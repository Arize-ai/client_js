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
export type RawAnnotationConfig = components["schemas"]["AnnotationConfig"];
export type RawPrompt = components["schemas"]["Prompt"];

export type RawGraphQLPromptVersion = {
  id: string;
  commitHash: string;
  commitMessage: string;
  messages: Record<string, unknown>[];
  inputVariableFormat: "F_STRING" | "MUSTACHE" | "NONE";
  provider: string;
  modelName?: string | null;
  llmParameters: Record<string, unknown>;
  labels?: string[];
  providerParameters?: Record<string, unknown>;
  createdAt: string;
};

export type RawGraphQLPrompt = {
  id: string;
  name: string;
  description?: string | null;
  messages: Record<string, unknown>[];
  inputVariableFormat: "F_STRING" | "MUSTACHE" | "NONE";
  provider: string;
  modelName?: string | null;
  commitHash: string;
  commitMessage: string;
  llmParameters: Record<string, unknown>;
  toolCalls?: Record<string, unknown>[] | null;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  versionHistory?: {
    edges: Array<{ node: RawGraphQLPromptVersion }>;
  };
};
