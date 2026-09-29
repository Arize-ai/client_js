import { createRemoteEvaluator } from "../src/evaluators";

/**
 * Creates a remote evaluator that calls a customer-hosted HTTP endpoint
 * on each evaluation run.
 *
 * Prerequisites:
 *   1. An EVALUATOR integration must already exist (create via
 *      `POST /v2/integrations` with `type: "EVALUATOR"`).
 *   2. The `enableRemoteEvalTasks` feature flag must be enabled on your account.
 */
(async () => {
  try {
    const evaluator = await createRemoteEvaluator({
      name: "My Remote Evaluator",
      space: "your_space_name",
      commitMessage: "Initial version",
      // The global ID of an existing EVALUATOR integration
      integrationId: "your_evaluator_integration_id",
      description: "Evaluates responses via a remote endpoint",
    });
    // eslint-disable-next-line no-console
    console.dir(evaluator, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating remote evaluator:", error);
  }
})();
