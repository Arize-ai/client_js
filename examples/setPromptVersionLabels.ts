import { setPromptVersionLabels } from "../src/prompts";

(async () => {
  try {
    const { labels } = await setPromptVersionLabels({
      versionId: "your_version_id",
      labels: ["production", "staging"],
    });
    // eslint-disable-next-line no-console
    console.log("Labels set:", labels);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error setting prompt version labels:", error);
  }
})();
