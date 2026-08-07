import { components } from "../__generated__/api/v2";
import { createClient } from "../client";
import { CreateTaskInput, Task, WithClient } from "../types";
import { findDatasetId, findProjectId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { toRawTaskEvaluator, transformTask } from "./utils";

export type CreateTaskParams = WithClient<CreateTaskInput>;

type CreateRunExpBody = components["schemas"]["CreateRunExperimentTaskRequest"];
type CreateEvalBody =
  | components["schemas"]["CreateTemplateEvaluationTaskRequest"]
  | components["schemas"]["CreateCodeEvaluationTaskRequest"];
type CreateTaskBody = CreateRunExpBody | CreateEvalBody;

/**
 * Create a new task. Dispatches on `type`:
 * - `"TEMPLATE_EVALUATION"` | `"CODE_EVALUATION"` — evaluation task.
 * - `"RUN_EXPERIMENT"` — server-side experiment task.
 *
 * For ergonomic, narrowly-typed helpers prefer {@link createEvaluationTask}
 * (for eval types) or {@link createRunExperimentTask} (for RUN_EXPERIMENT tasks,
 * which also supports resolving AI integration by name).
 *
 * **Note for `RUN_EXPERIMENT` tasks**: `runConfiguration` must include the
 * concrete integration ID directly (`ai_integration_id` for LLM variants,
 * `integration_id` for AGENT_CALL). The convenience name fields (`aiIntegration`
 * and `integration`) are only resolved by {@link createRunExperimentTask} —
 * passing one here without a corresponding ID will throw immediately.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The display name of the task.
 * @param type - The task type.
 * @returns A created {@link Task}.
 * @throws Error if the task cannot be created or the response is invalid.
 * @throws Error if `aiIntegration` (or `integration`) is set in
 *   `runConfiguration` without a corresponding `ai_integration_id`
 *   (or `integration_id`) — use {@link createRunExperimentTask} for name
 *   resolution.
 */
export async function createTask({
  client: clientInstance,
  ...input
}: CreateTaskParams): Promise<Task> {
  warnPreRelease({ functionName: "createTask", stage: "beta" });
  const client = clientInstance ?? createClient();

  let body: CreateTaskBody;

  if (input.type === "RUN_EXPERIMENT") {
    const spaceRef = toSpaceRef(input.space);
    const datasetId = await findDatasetId(client, input.dataset, spaceRef);

    // Strip the SDK-only convenience name fields (`aiIntegration` for the LLM
    // variants, `integration` for AGENT_CALL) before POSTing. The server schema
    // uses `additionalProperties: false` and would 400 if either field reached
    // it. If a caller set a name field without also providing the corresponding
    // ID, fail fast with a helpful message.
    const { aiIntegration, integration, ...rawConfig } =
      input.runConfiguration as typeof input.runConfiguration & {
        aiIntegration?: string;
        integration?: string;
      };
    if (
      aiIntegration &&
      !("ai_integration_id" in rawConfig && rawConfig.ai_integration_id)
    ) {
      throw new Error(
        "`createTask` does not resolve `aiIntegration` by name. " +
          "Either supply `ai_integration_id` directly in `runConfiguration`, " +
          "or use `createRunExperimentTask` which resolves the name for you.",
      );
    }
    if (
      integration &&
      !("integration_id" in rawConfig && rawConfig.integration_id)
    ) {
      throw new Error(
        "`createTask` does not resolve `integration` by name. " +
          "Either supply `integration_id` directly in `runConfiguration`, " +
          "or use `createRunExperimentTask` which resolves the name for you.",
      );
    }

    const runExpBody: CreateRunExpBody = {
      name: input.name,
      type: "RUN_EXPERIMENT",
      dataset_id: datasetId,
      run_configuration: rawConfig as components["schemas"]["RunConfiguration"],
    };
    body = runExpBody;
  } else {
    const spaceRef = toSpaceRef(input.space);
    const resolvedProjectId = input.project
      ? await findProjectId(client, input.project, spaceRef)
      : undefined;
    const resolvedDatasetId = input.dataset
      ? await findDatasetId(client, input.dataset, spaceRef)
      : undefined;
    const evalBody: CreateEvalBody = {
      name: input.name,
      type: input.type,
      project_id: resolvedProjectId,
      dataset_id: resolvedDatasetId,
      is_continuous: input.isContinuous,
      sampling_rate: input.samplingRate,
      experiment_ids: input.experimentIds,
      query_filter: input.queryFilter,
      evaluators: input.evaluators.map(toRawTaskEvaluator),
    };
    body = evalBody;
  }

  const response = await client.POST("/v2/tasks", { body });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformTask(response.data);
}
