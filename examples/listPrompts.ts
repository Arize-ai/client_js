import { listPrompts } from "../src/prompts";

const PROMPT_LIMIT = 5;

(async () => {
  try {
    const prompts = await listPrompts({ limit: PROMPT_LIMIT });
    // eslint-disable-next-line no-console
    console.dir(prompts, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing prompts:", error);
  }
})();
