import { listAiIntegrations } from "../src/ai_integrations";

(async () => {
  try {
    const integrations = await listAiIntegrations({ limit: 10 });
    // eslint-disable-next-line no-console
    console.dir(integrations, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing AI integrations:", error);
  }
})();
