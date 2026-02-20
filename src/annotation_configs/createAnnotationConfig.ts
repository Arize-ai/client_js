import { createClient } from "../client";
import {
  AnnotationConfig,
  CreateAnnotationConfigInput,
  WithClient,
} from "../types";
import { assertUnreachable } from "../utils/assertUnreachable";
import { warnPreRelease } from "../utils/warning";
import { transformAnnotationConfig } from "./utils";

export type CreateAnnotationConfigParams =
  WithClient<CreateAnnotationConfigInput>;

/**
 * Create a new annotation config.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the annotation config to create.
 * @param spaceId - The space ID to create the annotation config in.
 * @param type - The annotation config type: "continuous", "categorical", or "freeform".
 * @param minimumScore - The minimum score an annotation can be. Required when `type` is "continuous".
 * @param maximumScore - The maximum score an annotation can be. Required when `type` is "continuous".
 * @param values - A list of labels and optionally associated scores. Required when `type` is "categorical".
 * @param optimizationDirection - An optional direction of optimization. Relevant when `type` is "continuous" or "categorical".
 * @returns A created {@link AnnotationConfig}.
 * @throws Error if the annotation config cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createAnnotationConfig } from "@arizeai/ax-client"
 *
 * const annotationConfig = await createAnnotationConfig({
 *   name: "Accuracy",
 *   spaceId: "your_space_id",
 *   type: "categorical",
 *   values: [
 *     { label: "accurate", score: 1 },
 *     { label: "inaccurate", score: 0 },
 *   ],
 *   optimizationDirection: "maximize",
 * });
 * console.log(annotationConfig);
 * ```
 *
 */
export async function createAnnotationConfig({
  client: clientInstance,
  ...params
}: CreateAnnotationConfigParams): Promise<AnnotationConfig> {
  warnPreRelease({ functionName: "createAnnotationConfig" });
  const client = clientInstance ?? createClient();
  const annotationConfigType = params.type;
  let body;
  switch (annotationConfigType) {
    case "continuous":
      body = {
        name: params.name,
        space_id: params.spaceId,
        annotation_config_type: "continuous" as const,
        minimum_score: params.minimumScore,
        maximum_score: params.maximumScore,
        optimization_direction: params.optimizationDirection,
      };
      break;
    case "categorical":
      body = {
        name: params.name,
        space_id: params.spaceId,
        annotation_config_type: "categorical" as const,
        values: params.values,
        optimization_direction: params.optimizationDirection,
      };
      break;
    case "freeform":
      body = {
        name: params.name,
        space_id: params.spaceId,
        annotation_config_type: "freeform" as const,
      };
      break;
    default: {
      assertUnreachable(annotationConfigType);
    }
  }

  const response = await client.POST("/v2/annotation-configs", {
    body,
  });
  if (response.error) {
    const { detail, title } = response.error;
    throw new Error(detail || title);
  }
  return transformAnnotationConfig(response.data);
}
