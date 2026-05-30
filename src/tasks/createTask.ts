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
 * - `"template_evaluation"` | `"code_evaluation"` — evaluation task.
 * - `"run_experiment"` — server-side experiment task.
 *
 * For ergonomic, narrowly-typed helpers prefer {@link createEvaluationTask}
 * (for eval types) or {@link createRunExperimentTask} (for run_experiment tasks,
 * which also supports resolving AI integration by name).
 *
 * **Note for `run_experiment` tasks**: `runConfiguration` must include
 * `ai_integration_id` directly. The convenience `aiIntegration` name field is
 * only resolved by {@link createRunExperimentTask} — passing it here without
 * a corresponding `ai_integration_id` will throw immediately.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The display name of the task.
 * @param type - The task type.
 * @returns A created {@link Task}.
 * @throws Error if the task cannot be created or the response is invalid.
 * @throws Error if `aiIntegration` is set in `runConfiguration` without
 *   `ai_integration_id` — use {@link createRunExperimentTask} for name
 *   resolution.
 */
export async function createTask({
  client: clientInstance,
  ...input
}: CreateTaskParams): Promise<Task> {
  warnPreRelease({ functionName: "createTask", stage: "alpha" });
  const client = clientInstance ?? createClient();

  let body: CreateTaskBody;

  if (input.type === "run_experiment") {
    const spaceRef = toSpaceRef(input.space);
    const datasetId = await findDatasetId(client, input.dataset, spaceRef);

    // Strip the SDK-only `aiIntegration` convenience field before POSTing.
    // The server schema uses `additionalProperties: false` and would 400 if
    // this field reached it. If the caller set `aiIntegration` without also
    // providing `ai_integration_id`, fail fast with a helpful message.
    const { aiIntegration, ...rawConfig } =
      input.runConfiguration as typeof input.runConfiguration & {
        aiIntegration?: string;
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

    const runExpBody: CreateRunExpBody = {
      name: input.name,
      type: "run_experiment",
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
