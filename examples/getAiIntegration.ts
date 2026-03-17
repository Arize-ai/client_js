import { getAiIntegration } from "../src/ai_integrations";

(async () => {
  try {
    const integration = await getAiIntegration({
      integrationId: "your_integration_id",
    });
    // eslint-disable-next-line no-console
    console.dir(integration, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting AI integration:", error);
  }
})();
