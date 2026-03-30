import { updateAiIntegration } from "../src/ai_integrations";

(async () => {
  try {
    const integration = await updateAiIntegration({
      space: "your_space_name",
      integration: "your_integration_name",
      name: "Updated OpenAI Integration",
      modelNames: ["gpt-4o", "gpt-4o-mini"],
    });

    const { hasApiKey, ...safeIntegration } = integration;
    void hasApiKey;
    // eslint-disable-next-line no-console
    console.dir(safeIntegration, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating AI integration:", error);
  }
})();
