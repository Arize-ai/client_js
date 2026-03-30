import { deletePrompt } from "../src/prompts";

(async () => {
  try {
    await deletePrompt({
      space: "your_space_name",
      prompt: "your_prompt_name",
    });
    // eslint-disable-next-line no-console
    console.log("Prompt deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting prompt:", error);
  }
})();
