import { createWebhookSubscription } from "../src/webhooks";

(async () => {
  try {
    const subscription = await createWebhookSubscription({
      webhook: "deploy-notifier",
      organization: "your_organization_id",
      sourceType: "PROMPT",
      sourceId: "your_prompt_id",
      event: "PROMPT_VERSION_CREATED",
    });
    // eslint-disable-next-line no-console
    console.dir(subscription, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating webhook subscription:", error);
  }
})();
