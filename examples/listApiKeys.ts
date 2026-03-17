import { listApiKeys } from "../src/api_keys";

(async () => {
  try {
    const { data, pagination } = await listApiKeys({ limit: 10 });
    // eslint-disable-next-line no-console
    console.dir({ data, pagination }, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing API keys:", error);
  }
})();
