import { deleteEvaluatorVersions } from "../src/evaluators";

(async () => {
  try {
    const result = await deleteEvaluatorVersions({
      space: "your_space_name_or_id",
      evaluator: "your_evaluator_name",
      versionIds: ["your_version_id_1", "your_version_id_2"],
    });
    // eslint-disable-next-line no-console
    console.dir(result, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
