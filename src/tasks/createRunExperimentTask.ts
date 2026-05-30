import { createClient } from "../client";
import { CreateRunExperimentTaskInput, Task, WithClient } from "../types";
import { findAiIntegrationId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { createTask } from "./createTask";

// `type` is always "run_experiment" — callers don't need to supply it.
export type CreateRunExperimentTaskParams = WithClient<
  Omit<CreateRunExperimentTaskInput, "type">
>;

/**
 * Create a new `run_experiment` task.
 *
 * The server drives all LLM calls using the AI integration specified in
 * `runConfiguration`. No local execution is required.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The display name of the task. Must be unique within the space.
 * @param dataset - The dataset name or global ID (base64).
 * @param space - The space name or ID. Required when `dataset` is a name.
 * @param runConfiguration - Discriminated experiment configuration:
 *   - `experiment_type: "llm_generation"` — runs an LLM prompt against each example.
 *   - `experiment_type: "template_evaluation"` — runs a template-based LLM evaluator.
 *   Either variant may include an optional `aiIntegration` name field to resolve
 *   the AI integration by name instead of supplying `ai_integration_id` directly.
 * @returns A created {@link Task}.
 * @throws Error if the task cannot be created or the AI integration cannot be resolved.
 * @example
 * ```typescript
 * import { createRunExperimentTask, triggerTaskRun, waitForTaskRun } from "@arizeai/ax-client"
 *
 * const task = await createRunExperimentTask({
 *   name: "GPT-4o Baseline Task",
 *   dataset: "my-dataset",
 *   space: "my-space",
 *   runConfiguration: {
 *     experiment_type: "llm_generation",
 *     aiIntegration: "my-openai-integration",
 *     model_name: "gpt-4o",
 *     input_variable_format: "f_string",
 *     messages: [
 *       { role: "system", content: "You are a helpful assistant." },
 *       { role: "user", content: "Answer: {question}" },
 *     ],
 *   },
 * });
 *
 * // Trigger a run against the task
 * const run = await triggerTaskRun({ task: task.id, experimentName: "Run 1" });
 * const finalRun = await waitForTaskRun({ runId: run.id });
 * console.log(finalRun.status); // "completed" | "failed" | "cancelled"
 * ```
 */
export async function createRunExperimentTask({
  client: clientInstance,
  runConfiguration,
  space,
  ...rest
}: CreateRunExperimentTaskParams): Promise<Task> {
  warnPreRelease({ functionName: "createRunExperimentTask", stage: "alpha" });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);

  // Resolve aiIntegration name → ID if the convenience field was used.
  const { aiIntegration, ...rawConfig } =
    runConfiguration as typeof runConfiguration & {
      aiIntegration?: string;
    };

  let resolvedConfig = rawConfig;
  if (aiIntegration) {
    const aiIntegrationId = await findAiIntegrationId(
      client,
      aiIntegration,
      spaceRef,
    );
    resolvedConfig = { ...rawConfig, ai_integration_id: aiIntegrationId };
  }

  return createTask({
    client,
    type: "run_experiment" as const,
    space,
    runConfiguration: resolvedConfig,
    name: rest.name,
    dataset: rest.dataset,
  });
}
