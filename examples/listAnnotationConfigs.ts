import { listAnnotationConfigs } from "../src/annotation_configs";

const ANNOTATION_CONFIG_LIMIT = 5;

(async () => {
  try {
    const annotationConfigs = await listAnnotationConfigs({
      limit: ANNOTATION_CONFIG_LIMIT,
    });
    // eslint-disable-next-line no-console
    console.dir(annotationConfigs, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing annotation configs:", error);
  }
})();
