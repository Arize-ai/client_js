import { createEvaluatorVersion } from "../src/evaluators";

(async () => {
  try {
    const version = await createEvaluatorVersion({
      evaluatorId: "your_evaluator_id",
      commitMessage: "Improved prompt wording",
      templateConfig: {
        name: "Relevance",
        template:
          "Rate the relevance of the response on a scale of 0 to 1.\nQuery: {{query}}\nResponse: {{response}}",
        includeExplanations: true,
        useFunctionCallingIfAvailable: true,
        classificationChoices: { relevant: 1, irrelevant: 0 },
        direction: "maximize",
        llmConfig: {
          aiIntegrationId: "your_ai_integration_id",
          modelName: "gpt-4o",
          invocationParameters: { temperature: 0 },
          providerParameters: {},
        },
      },
    });
    // eslint-disable-next-line no-console
    console.dir(version, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating evaluator version:", error);
  }
})();
