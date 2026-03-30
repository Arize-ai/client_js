import { getAnnotationConfig } from "../src/annotation_configs";

async function main() {
  try {
    const annotationConfig = await getAnnotationConfig({
      space: "your_space_name",
      annotationConfig: "your_annotation_config_name",
    });
    // eslint-disable-next-line no-console
    console.dir(annotationConfig, { depth: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting annotation config:", error);
  }
}

main();
