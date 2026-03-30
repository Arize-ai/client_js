import { getAiIntegration } from "../src/ai_integrations";

(async () => {
  try {
    const integration = await getAiIntegration({
      space: "your_space_name",
      integration: "your_integration_name",
    });

    const { hasApiKey: _hasApiKey, ...safeIntegration } = integration;
    // eslint-disable-next-line no-console
    console.dir(safeIntegration, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting AI integration:", error);
  }
})();
