import { createClient } from "../client";
import {
  AnnotationConfig,
  UpdateCategoricalAnnotationConfig,
  UpdateContinuousAnnotationConfig,
  UpdateFreeformAnnotationConfig,
  WithClient,
} from "../types";
import { findAnnotationConfigId, toSpaceRef } from "../utils/resolve";
import { warnPreRelease } from "../utils/warning";
import { handleApiError } from "../errors";
import { transformAnnotationConfig } from "./utils";

export type UpdateContinuousAnnotationConfigParams = WithClient<
  {
    /**
     * The name or ID of the annotation config to update.
     */
    annotationConfig: string;
    /**
     * An optional space name or ID. Required when `annotationConfig` is a name.
     */
    space?: string;
  } & UpdateContinuousAnnotationConfig
>;

/**
 * Update a continuous annotation config.
 *
 * The stored config must be of type "CONTINUOUS" — a config's type is
 * immutable and cannot be changed. Any fields that are omitted are left
 * unchanged.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationConfig - The name or ID of the annotation config to update.
 * @param space - An optional space name or ID. Required when `annotationConfig` is a name.
 * @param name - An optional new name for the annotation config. Must be unique within the space.
 * @param minimumScore - An optional new minimum score.
 * @param maximumScore - An optional new maximum score.
 * @param optimizationDirection - An optional new direction of optimization.
 * @returns The updated {@link AnnotationConfig}.
 * @throws Error if the annotation config cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateContinuousAnnotationConfig } from "@arizeai/ax-client"
 *
 * const annotationConfig = await updateContinuousAnnotationConfig({
 *   annotationConfig: "Accuracy",
 *   space: "your_space",
 *   name: "Accuracy v2",
 *   minimumScore: 0,
 *   maximumScore: 10,
 *   optimizationDirection: "MAXIMIZE",
 * });
 * console.log(annotationConfig);
 * ```
 */
export async function updateContinuousAnnotationConfig({
  client: clientInstance,
  annotationConfig,
  space,
  name,
  minimumScore,
  maximumScore,
  optimizationDirection,
}: UpdateContinuousAnnotationConfigParams): Promise<AnnotationConfig> {
  warnPreRelease({
    functionName: "updateContinuousAnnotationConfig",
    stage: "beta",
  });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationConfigId = await findAnnotationConfigId(
    client,
    annotationConfig,
    spaceRef,
  );

  const response = await client.PATCH(
    "/v2/annotation-configs/{annotation_config_id}",
    {
      params: {
        path: {
          annotation_config_id: annotationConfigId,
        },
      },
      body: {
        annotation_config_type: "CONTINUOUS",
        name,
        minimum_score: minimumScore,
        maximum_score: maximumScore,
        optimization_direction: optimizationDirection,
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationConfig(response.data);
}

export type UpdateCategoricalAnnotationConfigParams = WithClient<
  {
    /**
     * The name or ID of the annotation config to update.
     */
    annotationConfig: string;
    /**
     * An optional space name or ID. Required when `annotationConfig` is a name.
     */
    space?: string;
  } & UpdateCategoricalAnnotationConfig
>;

/**
 * Update a categorical annotation config.
 *
 * The stored config must be of type "CATEGORICAL" — a config's type is
 * immutable and cannot be changed. Any fields that are omitted are left
 * unchanged.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationConfig - The name or ID of the annotation config to update.
 * @param space - An optional space name or ID. Required when `annotationConfig` is a name.
 * @param name - An optional new name for the annotation config. Must be unique within the space.
 * @param values - An optional full replacement set of labels (2-100 items).
 * @param optimizationDirection - An optional new direction of optimization.
 * @returns The updated {@link AnnotationConfig}.
 * @throws Error if the annotation config cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateCategoricalAnnotationConfig } from "@arizeai/ax-client"
 *
 * const annotationConfig = await updateCategoricalAnnotationConfig({
 *   annotationConfig: "Accuracy",
 *   space: "your_space",
 *   name: "Accuracy v2",
 *   values: [
 *     { label: "accurate", score: 1 },
 *     { label: "inaccurate", score: 0 },
 *   ],
 *   optimizationDirection: "MAXIMIZE",
 * });
 * console.log(annotationConfig);
 * ```
 */
export async function updateCategoricalAnnotationConfig({
  client: clientInstance,
  annotationConfig,
  space,
  name,
  values,
  optimizationDirection,
}: UpdateCategoricalAnnotationConfigParams): Promise<AnnotationConfig> {
  warnPreRelease({
    functionName: "updateCategoricalAnnotationConfig",
    stage: "beta",
  });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationConfigId = await findAnnotationConfigId(
    client,
    annotationConfig,
    spaceRef,
  );

  const response = await client.PATCH(
    "/v2/annotation-configs/{annotation_config_id}",
    {
      params: {
        path: {
          annotation_config_id: annotationConfigId,
        },
      },
      body: {
        annotation_config_type: "CATEGORICAL",
        name,
        values,
        optimization_direction: optimizationDirection,
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationConfig(response.data);
}

export type UpdateFreeformAnnotationConfigParams = WithClient<
  {
    /**
     * The name or ID of the annotation config to update.
     */
    annotationConfig: string;
    /**
     * An optional space name or ID. Required when `annotationConfig` is a name.
     */
    space?: string;
  } & UpdateFreeformAnnotationConfig
>;

/**
 * Update a freeform annotation config.
 *
 * The stored config must be of type "FREEFORM" — a config's type is
 * immutable and cannot be changed. Any fields that are omitted are left
 * unchanged.
 *
 * @param client - An optional ArizeClient instance to use for the request.
 * @param annotationConfig - The name or ID of the annotation config to update.
 * @param space - An optional space name or ID. Required when `annotationConfig` is a name.
 * @param name - An optional new name for the annotation config. Must be unique within the space.
 * @returns The updated {@link AnnotationConfig}.
 * @throws Error if the annotation config cannot be updated or the response is invalid.
 * @example
 * ```typescript
 * import { updateFreeformAnnotationConfig } from "@arizeai/ax-client"
 *
 * const annotationConfig = await updateFreeformAnnotationConfig({
 *   annotationConfig: "Notes",
 *   space: "your_space",
 *   name: "Notes v2",
 * });
 * console.log(annotationConfig);
 * ```
 */
export async function updateFreeformAnnotationConfig({
  client: clientInstance,
  annotationConfig,
  space,
  name,
}: UpdateFreeformAnnotationConfigParams): Promise<AnnotationConfig> {
  warnPreRelease({
    functionName: "updateFreeformAnnotationConfig",
    stage: "beta",
  });
  const client = clientInstance ?? createClient();
  const spaceRef = toSpaceRef(space);
  const annotationConfigId = await findAnnotationConfigId(
    client,
    annotationConfig,
    spaceRef,
  );

  const response = await client.PATCH(
    "/v2/annotation-configs/{annotation_config_id}",
    {
      params: {
        path: {
          annotation_config_id: annotationConfigId,
        },
      },
      body: {
        annotation_config_type: "FREEFORM",
        name,
      },
    },
  );
  if (response.error) {
    return handleApiError(response);
  }
  return transformAnnotationConfig(response.data);
}
