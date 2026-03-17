import { createPromptVersion } from "../src/prompts";

(async () => {
  try {
    const version = await createPromptVersion({
      promptId: "your_prompt_id",
      commitMessage: "Updated system prompt for better responses",
      inputVariableFormat: "f_string",
      provider: "openAI",
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a concise, helpful assistant." },
        { role: "user", content: "Hello, {name}!" },
      ],
    });
    // eslint-disable-next-line no-console
    console.dir(version, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating prompt version:", error);
  }
})();
