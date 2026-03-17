import { refreshApiKey } from "../src/api_keys";

(async () => {
  try {
    const { key, ...apiKeyMeta } = await refreshApiKey({
      apiKeyId: "your-api-key-id",
    });
    // eslint-disable-next-line no-console
    console.log("API key refreshed. Metadata:");
    // eslint-disable-next-line no-console
    console.dir(apiKeyMeta, { depth: null });
    // key contains the raw API key value — store it securely, it is only returned once.
    void key;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error refreshing API key:", error);
  }
})();
