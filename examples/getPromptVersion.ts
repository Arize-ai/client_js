import { getPromptVersion } from "../src/prompts";

(async () => {
  try {
    const version = await getPromptVersion({
      versionId: "your_version_id",
    });
    // eslint-disable-next-line no-console
    console.dir(version, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting prompt version:", error);
  }
})();
