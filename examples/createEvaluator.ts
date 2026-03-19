import { createEvaluator } from "../src/evaluators";

(async () => {
  try {
    const evaluator = await createEvaluator({
      name: "Relevance",
      spaceId: "your_space_id",
      type: "template",
      version: {
        commitMessage: "Initial version",
        templateConfig: {
          name: "Relevance",
          template:
            "Is the following response relevant to the query?\nQuery: {{query}}\nResponse: {{response}}",
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
      },
    });
    // eslint-disable-next-line no-console
    console.dir(evaluator, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating evaluator:", error);
  }
})();
