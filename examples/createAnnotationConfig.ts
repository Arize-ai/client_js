import { createAnnotationConfig } from "../src/annotation_configs";

(async () => {
  try {
    const annotationConfig = await createAnnotationConfig({
      name: "Accuracy",
      spaceId: "your_space_id",
      type: "categorical",
      values: [
        { label: "accurate", score: 1 },
        { label: "inaccurate", score: 0 },
      ],
      optimizationDirection: "maximize",
    });
    // eslint-disable-next-line no-console
    console.dir(annotationConfig, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating annotation config:", error);
  }
})();
