import { createAiIntegration } from "../src/ai_integrations";

(async () => {
  try {
    const integration = await createAiIntegration({
      name: "Production OpenAI",
      provider: "OPEN_AI",
      apiKey: "sk-...",
      modelNames: ["gpt-4o", "gpt-4o-mini"],
      enableDefaultModels: true,
    });

    const { hasApiKey: _hasApiKey, ...safeIntegration } = integration;
    // eslint-disable-next-line no-console
    console.dir(safeIntegration, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating AI integration:", error);
  }
})();
