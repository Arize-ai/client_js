import { getPrompt } from "../src/prompts";

(async () => {
  try {
    // Get latest version
    const latestPrompt = await getPrompt({ promptId: "your_prompt_id" });
    // eslint-disable-next-line no-console
    console.dir(latestPrompt, { depth: null });

    // Get the version tagged with the "production" label
    const productionPrompt = await getPrompt({
      promptId: "your_prompt_id",
      label: "production",
    });
    // eslint-disable-next-line no-console
    console.dir(productionPrompt, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting prompt:", error);
  }
})();
