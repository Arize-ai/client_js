import { refreshApiKey } from "../src/api_keys";

(async () => {
  try {
    // Basic refresh — old key invalidated immediately
    const { key, ...apiKeyMeta } = await refreshApiKey({
      apiKeyId: "your-api-key-id",
    });
    // eslint-disable-next-line no-console
    console.log("API key refreshed. Metadata:");
    // eslint-disable-next-line no-console
    console.dir(apiKeyMeta, { depth: null });
    // key contains the raw API key value — store it securely, it is only returned once.
    void key;

    // Refresh with a grace period — old key stays valid for 1 hour while you
    // roll over clients to the new key value.
    const { key: newKey, ...newApiKeyMeta } = await refreshApiKey({
      apiKeyId: "your-api-key-id",
      gracePeriodSeconds: 3600,
    });
    // eslint-disable-next-line no-console
    console.log("API key refreshed with grace period. Metadata:");
    // eslint-disable-next-line no-console
    console.dir(newApiKeyMeta, { depth: null });
    void newKey;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error refreshing API key:", error);
  }
})();
