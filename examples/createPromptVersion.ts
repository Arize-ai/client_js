import { createPromptVersion } from "../src/prompts";

(async () => {
  try {
    const version = await createPromptVersion({
      space: "your_space_name",
      prompt: "your_prompt_name",
      commitMessage: "Updated system prompt for better responses",
      inputVariableFormat: "F_STRING",
      provider: "OPEN_AI",
      model: "gpt-4",
      messages: [
        { role: "SYSTEM", content: "You are a concise, helpful assistant." },
        { role: "USER", content: "Hello, {name}!" },
      ],
    });
    // eslint-disable-next-line no-console
    console.dir(version, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating prompt version:", error);
  }
})();
