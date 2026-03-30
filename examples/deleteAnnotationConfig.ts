import { deleteAnnotationConfig } from "../src/annotation_configs";

(async () => {
  try {
    await deleteAnnotationConfig({
      space: "your_space_name",
      annotationConfig: "your_annotation_config_name",
    });
    // eslint-disable-next-line no-console
    console.log("Annotation config deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting annotation config:", error);
  }
})();
