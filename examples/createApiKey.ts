import { createApiKey } from "../src/api_keys";

(async () => {
  try {
    const apiKey = await createApiKey({ name: "example-key" });
    // eslint-disable-next-line no-console
    console.log(
      "API key created. Store this value securely — it is only shown once:",
    );
    // eslint-disable-next-line no-console
    console.log(apiKey.key);
    // eslint-disable-next-line no-console
    console.dir(apiKey, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating API key:", error);
  }
})();
