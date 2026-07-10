import {
  updateCategoricalAnnotationConfig,
  updateContinuousAnnotationConfig,
  updateFreeformAnnotationConfig,
} from "../src/annotation_configs";

async function updateCategorical() {
  const annotationConfig = await updateCategoricalAnnotationConfig({
    annotationConfig: "Accuracy",
    space: "your_space_name",
    name: "Accuracy v2",
    values: [
      { label: "accurate", score: 1 },
      { label: "inaccurate", score: 0 },
    ],
    optimizationDirection: "maximize",
  });
  // eslint-disable-next-line no-console
  console.dir(annotationConfig, { depth: null });
}

async function updateContinuous() {
  const annotationConfig = await updateContinuousAnnotationConfig({
    annotationConfig: "Response Quality",
    space: "your_space_name",
    name: "Response Quality v2",
    minimumScore: 0,
    maximumScore: 10,
    optimizationDirection: "maximize",
  });
  // eslint-disable-next-line no-console
  console.dir(annotationConfig, { depth: null });
}

async function updateFreeform() {
  const annotationConfig = await updateFreeformAnnotationConfig({
    annotationConfig: "Notes",
    space: "your_space_name",
    name: "Notes v2",
  });
  // eslint-disable-next-line no-console
  console.dir(annotationConfig, { depth: null });
}

(async () => {
  try {
    await updateCategorical();
    await updateContinuous();
    await updateFreeform();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating annotation config:", error);
  }
})();
