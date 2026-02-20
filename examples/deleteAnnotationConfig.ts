import { deleteAnnotationConfig } from "../src/annotation_configs";

(async () => {
  try {
    await deleteAnnotationConfig({
      annotationConfigId: "your_annotation_config_id",
    });
    // eslint-disable-next-line no-console
    console.log("Annotation config deleted successfully");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting annotation config:", error);
  }
})();
