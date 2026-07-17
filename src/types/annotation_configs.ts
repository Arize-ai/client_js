import { components } from "../__generated__/api/v2";

export type OptimizationDirection =
  components["schemas"]["OptimizationDirection"];

export type CategoricalAnnotationValue =
  components["schemas"]["CategoricalAnnotationValue"];

export interface AnnotationConfigBase {
  id: string;
  name: string;
  createdAt: Date;
  spaceId: string;
}

export interface ContinuousAnnotationConfig extends AnnotationConfigBase {
  type: "CONTINUOUS";
  minimumScore: number;
  maximumScore: number;
  optimizationDirection?: OptimizationDirection;
}

export interface CategoricalAnnotationConfig extends AnnotationConfigBase {
  type: "CATEGORICAL";
  values: CategoricalAnnotationValue[];
  optimizationDirection?: OptimizationDirection;
}

export interface FreeformAnnotationConfig extends AnnotationConfigBase {
  type: "FREEFORM";
}

export type AnnotationConfig =
  | ContinuousAnnotationConfig
  | CategoricalAnnotationConfig
  | FreeformAnnotationConfig;

export interface AnnotationConfigCreateBase {
  name: string;
  space: string;
}

export interface CreateContinuousAnnotationConfig extends AnnotationConfigCreateBase {
  type: "CONTINUOUS";
  minimumScore: number;
  maximumScore: number;
  optimizationDirection?: OptimizationDirection;
}

export interface CreateCategoricalAnnotationConfig extends AnnotationConfigCreateBase {
  type: "CATEGORICAL";
  values: CategoricalAnnotationValue[];
  optimizationDirection?: OptimizationDirection;
}

export interface CreateFreeformAnnotationConfig extends AnnotationConfigCreateBase {
  type: "FREEFORM";
}

export type CreateAnnotationConfigInput =
  | CreateContinuousAnnotationConfig
  | CreateCategoricalAnnotationConfig
  | CreateFreeformAnnotationConfig;

export interface UpdateContinuousAnnotationConfig {
  name?: string;
  minimumScore?: number;
  maximumScore?: number;
  optimizationDirection?: OptimizationDirection;
}

export interface UpdateCategoricalAnnotationConfig {
  name?: string;
  values?: CategoricalAnnotationValue[];
  optimizationDirection?: OptimizationDirection;
}

export interface UpdateFreeformAnnotationConfig {
  name?: string;
}
