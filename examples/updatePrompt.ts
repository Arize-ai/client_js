import { updatePrompt } from "../src/prompts/updatePrompt";

(async () => {
  try {
    const prompt = await updatePrompt({
      promptId: "your_prompt_id",
      description: "Updated description",
      tags: ["updated-tag"],
    });
    // eslint-disable-next-line no-console
    console.dir(prompt, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating prompt:", error);
  }
})();
