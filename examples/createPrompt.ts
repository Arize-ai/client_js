import { createPrompt } from "../src/prompts";

(async () => {
  try {
    const prompt = await createPrompt({
      space: "your_space_name",
      name: "customer-support",
      description: "A prompt for customer support interactions",
      version: {
        commitMessage: "Initial version",
        inputVariableFormat: "F_STRING",
        provider: "OPEN_AI",
        model: "gpt-4",
        messages: [
          { role: "SYSTEM", content: "You are a helpful assistant." },
          { role: "USER", content: "Hello, {name}!" },
        ],
        invocationParams: {
          temperature: 0.7,
          max_tokens: 1000,
        },
      },
    });
    // eslint-disable-next-line no-console
    console.dir(prompt, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating prompt:", error);
  }
})();
