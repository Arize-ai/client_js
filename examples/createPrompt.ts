import { createPrompt } from "../src/prompts";

(async () => {
  try {
    const prompt = await createPrompt({
      space: "your_space_name",
      name: "customer-support",
      description: "A prompt for customer support interactions",
      version: {
        commitMessage: "Initial version",
        inputVariableFormat: "f_string",
        provider: "openAI",
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello, {name}!" },
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
