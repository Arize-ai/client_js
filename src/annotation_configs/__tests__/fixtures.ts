import { RawAnnotationConfig } from "../../types/internal";

export const mockRawCategoricalAnnotationConfig: RawAnnotationConfig = {
  id: "ac_abc123",
  name: "Accuracy",
  created_at: "2024-01-15T00:00:00Z",
  space_id: "spc_xyz789",
  type: "categorical",
  values: [
    { label: "accurate", score: 1 },
    { label: "inaccurate", score: 0 },
  ],
  optimization_direction: "maximize",
};

export const mockRawContinuousAnnotationConfig: RawAnnotationConfig = {
  id: "ac_abc123",
  name: "Accuracy",
  created_at: "2024-01-15T00:00:00Z",
  space_id: "spc_xyz789",
  type: "continuous",
  minimum_score: 0,
  maximum_score: 10,
  optimization_direction: "maximize",
};

export const mockRawFreeformAnnotationConfig: RawAnnotationConfig = {
  id: "ac_abc123",
  name: "Notes",
  created_at: "2024-01-15T00:00:00Z",
  space_id: "spc_xyz789",
  type: "freeform",
};
