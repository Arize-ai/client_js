import { updateAiIntegration } from "../src/ai_integrations";

(async () => {
  try {
    const integration = await updateAiIntegration({
      integrationId: "your_integration_id",
      name: "Updated OpenAI Integration",
      modelNames: ["gpt-4o", "gpt-4o-mini"],
    });
    // eslint-disable-next-line no-console
    console.dir(integration, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating AI integration:", error);
  }
})();
