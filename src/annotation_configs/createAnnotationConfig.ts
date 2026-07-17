import { createClient } from "../client";
import {
  CategoricalAnnotationConfig,
  ContinuousAnnotationConfig,
  CreateCategoricalAnnotationConfig,
  CreateContinuousAnnotationConfig,
  CreateFreeformAnnotationConfig,
  FreeformAnnotationConfig,
  WithClient,
} from "../types";
import { findSpaceId } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformAnnotationConfig } from "./utils";

export type CreateContinuousAnnotationConfigParams = WithClient<
  Omit<CreateContinuousAnnotationConfig, "type">
>;

/**
 * Create a continuous annotation config, i.e. a numeric score within a fixed
 * range (e.g. a 0-1 quality score).
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the annotation config to create.
 * @param space - The space name or ID to create the annotation config in.
 * @param minimumScore - The minimum score an annotation can be.
 * @param maximumScore - The maximum score an annotation can be.
 * @param optimizationDirection - An optional direction of optimization.
 * @returns A created {@link ContinuousAnnotationConfig}.
 * @throws Error if the annotation config cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createContinuousAnnotationConfig } from "@arizeai/ax-client"
 *
 * const annotationConfig = await createContinuousAnnotationConfig({
 *   name: "quality-score",
 *   space: "your_space",
 *   minimumScore: 0,
 *   maximumScore: 1,
 *   optimizationDirection: "MAXIMIZE",
 * });
 * console.log(annotationConfig);
 * ```
 */
export async function createContinuousAnnotationConfig({
  client: clientInstance,
  ...params
}: CreateContinuousAnnotationConfigParams): Promise<ContinuousAnnotationConfig> {
  warnPreRelease({
    functionName: "createContinuousAnnotationConfig",
    stage: "beta",
  });
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, params.space);
  const response = await client.POST("/v2/annotation-configs", {
    body: {
      name: params.name,
      space_id: spaceId,
      annotation_config_type: "CONTINUOUS" as const,
      minimum_score: params.minimumScore,
      maximum_score: params.maximumScore,
      optimization_direction: params.optimizationDirection,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationConfig(response.data) as ContinuousAnnotationConfig;
}

export type CreateCategoricalAnnotationConfigParams = WithClient<
  Omit<CreateCategoricalAnnotationConfig, "type">
>;

/**
 * Create a categorical annotation config, i.e. a fixed set of labeled values
 * a scorer can choose from (e.g. "correct" / "incorrect").
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the annotation config to create.
 * @param space - The space name or ID to create the annotation config in.
 * @param values - A list of labels and optionally associated scores.
 * @param optimizationDirection - An optional direction of optimization.
 * @returns A created {@link CategoricalAnnotationConfig}.
 * @throws Error if the annotation config cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createCategoricalAnnotationConfig } from "@arizeai/ax-client"
 *
 * const annotationConfig = await createCategoricalAnnotationConfig({
 *   name: "correctness",
 *   space: "your_space",
 *   values: [
 *     { label: "correct", score: 1 },
 *     { label: "incorrect", score: 0 },
 *   ],
 *   optimizationDirection: "MAXIMIZE",
 * });
 * console.log(annotationConfig);
 * ```
 */
export async function createCategoricalAnnotationConfig({
  client: clientInstance,
  ...params
}: CreateCategoricalAnnotationConfigParams): Promise<CategoricalAnnotationConfig> {
  warnPreRelease({
    functionName: "createCategoricalAnnotationConfig",
    stage: "beta",
  });
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, params.space);
  const response = await client.POST("/v2/annotation-configs", {
    body: {
      name: params.name,
      space_id: spaceId,
      annotation_config_type: "CATEGORICAL" as const,
      values: params.values,
      optimization_direction: params.optimizationDirection,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationConfig(
    response.data,
  ) as CategoricalAnnotationConfig;
}

export type CreateFreeformAnnotationConfigParams = WithClient<
  Omit<CreateFreeformAnnotationConfig, "type">
>;

/**
 * Create a freeform annotation config, i.e. open-ended text feedback with no
 * predefined scale or set of values.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param name - The name of the annotation config to create.
 * @param space - The space name or ID to create the annotation config in.
 * @returns A created {@link FreeformAnnotationConfig}.
 * @throws Error if the annotation config cannot be created or the response is invalid.
 * @example
 * ```typescript
 * import { createFreeformAnnotationConfig } from "@arizeai/ax-client"
 *
 * const annotationConfig = await createFreeformAnnotationConfig({
 *   name: "reviewer-notes",
 *   space: "your_space",
 * });
 * console.log(annotationConfig);
 * ```
 */
export async function createFreeformAnnotationConfig({
  client: clientInstance,
  ...params
}: CreateFreeformAnnotationConfigParams): Promise<FreeformAnnotationConfig> {
  warnPreRelease({
    functionName: "createFreeformAnnotationConfig",
    stage: "beta",
  });
  const client = clientInstance ?? createClient();
  const spaceId = await findSpaceId(client, params.space);
  const response = await client.POST("/v2/annotation-configs", {
    body: {
      name: params.name,
      space_id: spaceId,
      annotation_config_type: "FREEFORM" as const,
    },
  });
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationConfig(response.data) as FreeformAnnotationConfig;
}
