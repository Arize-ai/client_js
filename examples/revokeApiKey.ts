import { revokeApiKey } from "../src/api_keys";

const API_KEY_ID = process.env.API_KEY_ID ?? "";

(async () => {
  if (!API_KEY_ID) {
    // eslint-disable-next-line no-console
    console.error(
      "Set the API_KEY_ID environment variable to the ID of the key to revoke.",
    );
    process.exit(1);
  }
  try {
    await revokeApiKey({ apiKeyId: API_KEY_ID });
    // eslint-disable-next-line no-console
    console.log("API key revoked.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error revoking API key:", error);
  }
})();
