import { setPromptVersionLabels } from "../src/prompts";

(async () => {
  try {
    const version = await setPromptVersionLabels({
      versionId: "your_version_id",
      labels: ["production", "staging"],
    });
    // eslint-disable-next-line no-console
    console.log("Labels set:", version.labels);
    // eslint-disable-next-line no-console
    console.log("Updated version:", version);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error setting prompt version labels:", error);
  }
})();
