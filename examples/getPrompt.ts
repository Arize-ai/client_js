import { getPrompt } from "../src/prompts/getPrompt";

(async () => {
  try {
    const prompt = await getPrompt({ promptId: "your_prompt_id" });
    // eslint-disable-next-line no-console
    console.dir(prompt, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting prompt:", error);
  }
})();
