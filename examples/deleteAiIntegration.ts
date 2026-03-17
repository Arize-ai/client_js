import { deleteAiIntegration } from "../src/ai_integrations";

(async () => {
  try {
    await deleteAiIntegration({
      integrationId: "your_integration_id",
    });
    // eslint-disable-next-line no-console
    console.log("AI integration deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting AI integration:", error);
  }
})();
