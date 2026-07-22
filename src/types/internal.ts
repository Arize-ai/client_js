import { components } from "../__generated__/api/v2";
import {
  ApiKeyAccountRoleAssignment,
  ApiKeyOrgRoleAssignment,
  ApiKeySpaceRoleAssignment,
} from "./api_keys";

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
  components["responses"]["ListDatasetExamplesResponse"]["content"]["application/json"];
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

// openapi-typescript generates Omit<Union, "type"> (non-distributive) for role
// fields, which is structurally incompatible with the SDK's DistributiveOmit
// types. Redefine the bot_user chain here so transformApiKeyCreated can map
// them without casts. The coercion is applied once at the HTTP boundary
// (createApiKey / refreshApiKey) via `as unknown as RawApiKeyCreated`.
type RawBotUserSpaceAssignment = Omit<
  components["schemas"]["ServiceKeyBotUserSpaceAssignment"],
  "role"
> & { role: ApiKeySpaceRoleAssignment };

type RawBotUserOrgAssignment = Omit<
  components["schemas"]["ServiceKeyBotUserOrgAssignment"],
  "role" | "spaces"
> & { role: ApiKeyOrgRoleAssignment; spaces: RawBotUserSpaceAssignment[] };

type RawServiceKeyBotUser = Omit<
  components["schemas"]["ServiceKeyBotUser"],
  "account_role" | "organizations"
> & {
  account_role: ApiKeyAccountRoleAssignment;
  organizations: RawBotUserOrgAssignment[];
};

type RawServiceApiKeyCreated = Omit<
  components["schemas"]["ServiceApiKeyCreated"],
  "bot_user"
> & { bot_user: RawServiceKeyBotUser };

export type RawApiKeyCreated =
  | components["schemas"]["UserApiKeyCreated"]
  | RawServiceApiKeyCreated;
export type RawRefreshApiKey = RawApiKey & { key: string };
export type RawTask = components["schemas"]["Task"];
export type RawTaskEvaluator = components["schemas"]["TaskEvaluator"];
export type RawTaskRun = components["schemas"]["TaskRun"];
export type RawEvaluator = components["schemas"]["Evaluator"];
export type RawEvaluatorWithVersion =
  components["schemas"]["EvaluatorWithVersion"];
export type RawEvaluatorVersion = components["schemas"]["EvaluatorVersion"];
export type RawTemplateConfig = components["schemas"]["TemplateConfig"];
export type RawEvaluatorLlmConfig = components["schemas"]["EvaluatorLlmConfig"];
export type RawCodeConfig = components["schemas"]["CodeConfig"];
export type RawManagedCodeConfig = components["schemas"]["ManagedCodeConfig"];
export type RawCustomCodeConfig = components["schemas"]["CustomCodeConfig"];
export type RawStaticParam = components["schemas"]["StaticParam"];
export type RawAnnotationQueue = components["schemas"]["AnnotationQueue"];
export type RawAnnotationQueueRecord =
  components["schemas"]["AnnotationQueueRecord"];
export type RawAnnotateAnnotationQueueRecordResponse =
  components["schemas"]["AnnotateAnnotationQueueRecordResponse"];
export type RawAssignAnnotationQueueRecordResponse =
  components["schemas"]["AssignAnnotationQueueRecordResponse"];
export type RawRole = components["schemas"]["Role"];
export type RawPermission = components["schemas"]["Permission"];
export type RawResourceRestriction =
  components["schemas"]["ResourceRestriction"];
export type RawResourceRestrictionType =
  components["schemas"]["ResourceRestrictionType"];
export type RawRoleBinding = components["schemas"]["RoleBinding"];
export type RawSpaceMembership = components["schemas"]["SpaceMembership"];
export type RawOrganization = components["schemas"]["Organization"];
export type RawOrganizationMembership =
  components["schemas"]["OrganizationMembership"];
export type RawCreateRoleBindingRequest =
  components["schemas"]["CreateRoleBindingRequest"];
export type RawRoleBindingResourceType =
  components["schemas"]["RoleBindingResourceType"];
export type RawAnnotationBatchResult =
  components["schemas"]["AnnotationBatchResult"];
export type RawAnnotateRecordResult =
  components["schemas"]["AnnotateRecordResult"];
export type RawUser = components["schemas"]["User"];
export type RawCreateUserResponse = components["schemas"]["CreateUserResponse"];
export type RawAuditLog = components["schemas"]["AuditLog"];
