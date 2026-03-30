import { updatePrompt } from "../src/prompts";

(async () => {
  try {
    const updated = await updatePrompt({
      space: "your_space_name",
      prompt: "your_prompt_name",
      description: "Updated description for the prompt",
    });
    // eslint-disable-next-line no-console
    console.dir(updated, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating prompt:", error);
  }
})();
