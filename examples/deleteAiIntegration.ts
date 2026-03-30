import { deleteAiIntegration } from "../src/ai_integrations";

(async () => {
  try {
    await deleteAiIntegration({
      space: "your_space_name",
      integration: "your_integration_name",
    });
    // eslint-disable-next-line no-console
    console.log("AI integration deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting AI integration:", error);
  }
})();
