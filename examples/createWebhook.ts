import { createWebhook } from "../src/webhooks";

(async () => {
  try {
    const webhook = await createWebhook({
      organization: "your_organization_id",
      name: "deploy-notifier",
      url: "https://example.com/hooks/arize",
      description: "Posts prompt changes to the deploy channel",
      authType: "HMAC_SHA256",
      timeoutMs: 10000,
    });

    // signingSecret is returned only here. Store it now; it cannot be read again.
    const { signingSecret: _signingSecret, ...safeWebhook } = webhook;
    // eslint-disable-next-line no-console
    console.dir(safeWebhook, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating webhook:", error);
  }
})();
