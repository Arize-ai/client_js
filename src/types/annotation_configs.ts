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
  type: "continuous";
  minimumScore: number;
  maximumScore: number;
  optimizationDirection?: OptimizationDirection;
}

export interface CategoricalAnnotationConfig extends AnnotationConfigBase {
  type: "categorical";
  values: CategoricalAnnotationValue[];
  optimizationDirection?: OptimizationDirection;
}

export interface FreeformAnnotationConfig extends AnnotationConfigBase {
  type: "freeform";
}

export type AnnotationConfig =
  | ContinuousAnnotationConfig
  | CategoricalAnnotationConfig
  | FreeformAnnotationConfig;

export interface AnnotationConfigCreateBase {
  name: string;
  spaceId: string;
}

export interface CreateContinuousAnnotationConfig extends AnnotationConfigCreateBase {
  type: "continuous";
  minimumScore: number;
  maximumScore: number;
  optimizationDirection?: OptimizationDirection;
}

export interface CreateCategoricalAnnotationConfig extends AnnotationConfigCreateBase {
  type: "categorical";
  values: CategoricalAnnotationValue[];
  optimizationDirection?: OptimizationDirection;
}

export interface CreateFreeformAnnotationConfig extends AnnotationConfigCreateBase {
  type: "freeform";
}

export type CreateAnnotationConfigInput =
  | CreateContinuousAnnotationConfig
  | CreateCategoricalAnnotationConfig
  | CreateFreeformAnnotationConfig;
