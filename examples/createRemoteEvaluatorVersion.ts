import { createRemoteEvaluatorVersion } from "../src/evaluators";

/**
 * Creates a new remote version of an existing REMOTE evaluator.
 *
 * The new version becomes the latest version immediately. The integration
 * is shared across evaluator versions; updating it will affect all versions
 * that reference it.
 *
 * Prerequisites:
 *   1. A REMOTE evaluator must already exist.
 *   2. An EVALUATOR integration must already exist.
 *   3. The `enableRemoteEvalTasks` feature flag must be enabled on your account.
 */
(async () => {
  try {
    const version = await createRemoteEvaluatorVersion({
      evaluator: "your_evaluator_name_or_id",
      space: "your_space_name",
      commitMessage: "Switch to updated endpoint",
      // The global ID of an existing EVALUATOR integration
      integrationId: "your_evaluator_integration_id",
    });
    // eslint-disable-next-line no-console
    console.dir(version, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating remote evaluator version:", error);
  }
})();
