import { createClient } from "../client";
import {
  CreateRunExperimentTaskInput,
  RunExperimentConfigInput,
  Task,
  WithClient,
} from "../types";
import {
  findAiIntegrationId,
  findIntegrationId,
  toSpaceRef,
} from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { createTask } from "./createTask";

// `type` is always "RUN_EXPERIMENT" — callers don't need to supply it.
export type CreateRunExperimentTaskParams = WithClient<
  Omit<CreateRunExperimentTaskInput, "type">
>;

/**
 * Create a new `RUN_EXPERIMENT` task.
 *
 * The server drives all LLM calls using the AI integration specified in
 * `runConfiguration`. No local execution is required.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The display name of the task. Must be unique within the space.
 * @param dataset - The dataset name or global ID (base64).
 * @param space - The space name or ID. Required when `dataset` is a name.
 * @param runConfiguration - Discriminated experiment configuration:
 *   - `experiment_type: "LLM_GENERATION"` — runs an LLM prompt against each example.
 *   - `experiment_type: "TEMPLATE_EVALUATION"` — runs a template-based LLM evaluator.
 *   - `experiment_type: "AGENT_CALL"` — invokes an agent integration against each example.
 *   The LLM variants may include an optional `aiIntegration` name field to resolve
 *   the AI integration by name instead of supplying `ai_integration_id` directly.
 *   The AGENT_CALL variant may include an optional `integration` name field to
 *   resolve the AGENT integration by name instead of supplying `integration_id`.
 * @returns A created {@link Task}.
 * @throws Error if the task cannot be created or the integration cannot be resolved.
 * @example
 * ```typescript
 * import { createRunExperimentTask, triggerTaskRun, waitForTaskRun } from "@arizeai/ax-client"
 *
 * const task = await createRunExperimentTask({
 *   name: "GPT-4o Baseline Task",
 *   dataset: "my-dataset",
 *   space: "my-space",
 *   runConfiguration: {
 *     experiment_type: "LLM_GENERATION",
 *     aiIntegration: "my-openai-integration",
 *     model_name: "gpt-4o",
 *     input_variable_format: "F_STRING",
 *     messages: [
 *       { role: "SYSTEM", content: "You are a helpful assistant." },
 *       { role: "USER", content: "Answer: {question}" },
 *     ],
 *   },
 * });
 *
 * // Trigger a run against the task
 * const run = await triggerTaskRun({ task: task.id, experimentName: "Run 1" });
 * const finalRun = await waitForTaskRun({ runId: run.id });
 * console.log(finalRun.status); // "COMPLETED" | "FAILED" | "CANCELLED"
 * ```
 */
export async function createRunExperimentTask({
  client: clientInstance,
  runConfiguration,
  space,
  ...rest
}: CreateRunExperimentTaskParams): Promise<Task> {
  warnPreRelease({ functionName: "createRunExperimentTask", stage: "beta" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);

  // Resolve the SDK-only convenience integration field (if used) to a concrete
  // ID before sending. AGENT_CALL uses `integration` → `integration_id` via an
  // AGENT-typed lookup; the LLM variants use `aiIntegration` → `ai_integration_id`.
  let resolvedConfig: RunExperimentConfigInput;
  if (runConfiguration.experiment_type === "AGENT_CALL") {
    const { integration, ...rawConfig } = runConfiguration;
    resolvedConfig = rawConfig;
    if (integration) {
      const integrationId = await findIntegrationId(
        client,
        integration,
        "AGENT",
        spaceRef,
      );
      resolvedConfig = { ...rawConfig, integration_id: integrationId };
    }
  } else {
    const { aiIntegration, ...rawConfig } = runConfiguration;
    resolvedConfig = rawConfig;
    if (aiIntegration) {
      const aiIntegrationId = await findAiIntegrationId(
        client,
        aiIntegration,
        spaceRef,
      );
      resolvedConfig = { ...rawConfig, ai_integration_id: aiIntegrationId };
    }
  }

  return createTask({
    client,
    type: "RUN_EXPERIMENT" as const,
    space,
    runConfiguration: resolvedConfig,
    name: rest.name,
    dataset: rest.dataset,
  });
}
