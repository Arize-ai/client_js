import { listWebhookDeliveryAttempts } from "../src/webhooks";

(async () => {
  try {
    const attempts = await listWebhookDeliveryAttempts({
      webhook: "deploy-notifier",
      organization: "your_organization_id",
      limit: 20,
    });
    // eslint-disable-next-line no-console
    console.dir(attempts, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing webhook delivery attempts:", error);
  }
})();
