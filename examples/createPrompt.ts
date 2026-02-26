import { createPrompt } from "../src/prompts/createPrompt";

(async () => {
  try {
    const prompt = await createPrompt({
      spaceId: "your_space_id",
      name: "my-prompt",
      commitMessage: "Initial version",
      inputVariableFormat: "f_string",
      provider: "openAI",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, {name}!" },
      ],
    });
    // eslint-disable-next-line no-console
    console.dir(prompt, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating prompt:", error);
  }
})();
