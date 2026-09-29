import { listWebhooks } from "../src/webhooks";

(async () => {
  try {
    const webhooks = await listWebhooks({
      organization: "your_organization_id",
      limit: 10,
    });
    // eslint-disable-next-line no-console
    console.dir(webhooks, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing webhooks:", error);
  }
})();
