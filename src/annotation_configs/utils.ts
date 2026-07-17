import { AnnotationConfig } from "../types";
import { RawAnnotationConfig } from "../types/internal";
import { assertUnreachable } from "../utils/assertUnreachable";

export function transformAnnotationConfig(
  annotationConfig: RawAnnotationConfig,
): AnnotationConfig {
  const baseConfig = {
    id: annotationConfig.id,
    name: annotationConfig.name,
    createdAt: new Date(annotationConfig.created_at),
    spaceId: annotationConfig.space_id,
  };

  const annotationConfigType = annotationConfig.type;

  switch (annotationConfigType) {
    case "CONTINUOUS":
      return {
        ...baseConfig,
        type: "CONTINUOUS",
        minimumScore: annotationConfig.minimum_score,
        maximumScore: annotationConfig.maximum_score,
        optimizationDirection: annotationConfig.optimization_direction,
      };
    case "CATEGORICAL":
      return {
        ...baseConfig,
        type: "CATEGORICAL",
        values: annotationConfig.values,
        optimizationDirection: annotationConfig.optimization_direction,
      };
    case "FREEFORM":
      return {
        ...baseConfig,
        type: "FREEFORM",
      };
    default:
      assertUnreachable(annotationConfigType);
  }
}
