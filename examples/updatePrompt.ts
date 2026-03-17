import { updatePrompt } from "../src/prompts";

(async () => {
  try {
    const updated = await updatePrompt({
      promptId: "your_prompt_id",
      description: "Updated description for the prompt",
    });
    // eslint-disable-next-line no-console
    console.dir(updated, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating prompt:", error);
  }
})();
