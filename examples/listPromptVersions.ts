import { listPromptVersions } from "../src/prompts";

(async () => {
  try {
    const { data: versions, pagination } = await listPromptVersions({
      promptId: "your_prompt_id",
      limit: 10,
    });
    // eslint-disable-next-line no-console
    console.dir({ versions, pagination }, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing prompt versions:", error);
  }
})();
