import { getEvaluatorVersion } from "../src/evaluators";

(async () => {
  try {
    const version = await getEvaluatorVersion({
      versionId: "your_version_id",
    });
    // eslint-disable-next-line no-console
    console.dir(version, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting evaluator version:", error);
  }
})();
