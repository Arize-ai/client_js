import { deletePrompt } from "../src/prompts/deletePrompt";

(async () => {
  try {
    await deletePrompt({ promptId: "your_prompt_id" });
    // eslint-disable-next-line no-console
    console.log("Prompt deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting prompt:", error);
  }
})();
