import { components } from "../__generated__/api/v2";

export type RawDataset = components["schemas"]["Dataset"];
export type RawDatasetVersion = components["schemas"]["DatasetVersion"];
export type RawDatasetVersionWithExampleIds =
  components["schemas"]["DatasetVersionWithExampleIds"];
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
export type RawSpan = components["schemas"]["Span"];
export type RawSpanContext = components["schemas"]["SpanContext"];
export type RawSpanEvent = components["schemas"]["SpanEvent"];
export type RawAnnotation = components["schemas"]["Annotation"];
export type RawEvaluation = components["schemas"]["Evaluation"];
export type RawSpace = components["schemas"]["Space"];
export type RawPrompt = components["schemas"]["Prompt"];
export type RawPromptVersion = components["schemas"]["PromptVersion"];
export type RawPromptWithVersion = components["schemas"]["PromptWithVersion"];
export type RawAiIntegration = components["schemas"]["AiIntegration"];
export type RawApiKey = components["schemas"]["ApiKey"];
export type RawApiKeyCreated = components["schemas"]["ApiKeyCreated"];
export type RawTask = components["schemas"]["Task"];
export type RawTaskEvaluator = components["schemas"]["TaskEvaluator"];
export type RawTaskRun = components["schemas"]["TaskRun"];
export type RawEvaluator = components["schemas"]["Evaluator"];
export type RawEvaluatorWithVersion =
  components["schemas"]["EvaluatorWithVersion"];
export type RawEvaluatorVersion = components["schemas"]["EvaluatorVersion"];
export type RawTemplateConfig = components["schemas"]["TemplateConfig"];
export type RawEvaluatorLlmConfig = components["schemas"]["EvaluatorLlmConfig"];
export type RawAnnotationQueue = components["schemas"]["AnnotationQueue"];
export type RawAnnotationQueueRecord =
  components["schemas"]["AnnotationQueueRecord"];
export type RawAnnotationQueueRecordAnnotateResult =
  components["schemas"]["AnnotationQueueRecordAnnotateResult"];
export type RawAnnotationQueueRecordAssignResult =
  components["schemas"]["AnnotationQueueRecordAssignResult"];
export type RawRole = components["schemas"]["Role"];
export type RawPermission = components["schemas"]["Permission"];
export type RawResourceRestriction =
  components["schemas"]["ResourceRestriction"];
export type RawRoleBinding = components["schemas"]["RoleBinding"];
export type RawOrganization = components["schemas"]["Organization"];
export type RawRoleBindingCreate = components["schemas"]["RoleBindingCreate"];
export type RawRoleBindingResourceType =
  components["schemas"]["RoleBindingResourceType"];
export type RawAnnotationBatchResult =
  components["schemas"]["AnnotationBatchResult"];
export type RawAnnotateRecordResult =
  components["schemas"]["AnnotateRecordResult"];
