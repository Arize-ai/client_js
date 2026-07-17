import {
  createCategoricalAnnotationConfig,
  createContinuousAnnotationConfig,
  createFreeformAnnotationConfig,
} from "../src/annotation_configs";

(async () => {
  try {
    // Type-specific helpers give you compile-time checking of which fields
    // are required for each annotation config type.
    const categorical = await createCategoricalAnnotationConfig({
      name: "Accuracy",
      space: "your_space_name",
      values: [
        { label: "accurate", score: 1 },
        { label: "inaccurate", score: 0 },
      ],
      optimizationDirection: "MAXIMIZE",
    });
    // eslint-disable-next-line no-console
    console.dir(categorical, { depth: null });

    const continuous = await createContinuousAnnotationConfig({
      name: "Quality Score",
      space: "your_space_name",
      minimumScore: 0,
      maximumScore: 1,
      optimizationDirection: "MAXIMIZE",
    });
    // eslint-disable-next-line no-console
    console.dir(continuous, { depth: null });

    const freeform = await createFreeformAnnotationConfig({
      name: "Reviewer Notes",
      space: "your_space_name",
    });
    // eslint-disable-next-line no-console
    console.dir(freeform, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating annotation config:", error);
  }
})();
