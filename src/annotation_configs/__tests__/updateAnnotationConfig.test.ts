import { beforeEach, describe, expect, it, vi } from "vitest";
import * as resolveModule from "../../utils/resolve";
import {
  mockRawCategoricalAnnotationConfig,
  mockRawContinuousAnnotationConfig,
  mockRawFreeformAnnotationConfig,
} from "./fixtures";
import {
  updateCategoricalAnnotationConfig,
  updateContinuousAnnotationConfig,
  updateFreeformAnnotationConfig,
} from "../updateAnnotationConfig";

describe("updateAnnotationConfig", () => {
  const patch = vi.fn();

  const mockClient = {
    PATCH: patch,
  } as never;

  beforeEach(() => {
    vi.restoreAllMocks();
    patch.mockReset();
    vi.spyOn(resolveModule, "findAnnotationConfigId").mockResolvedValue(
      "resolved-config-id",
    );
    vi.spyOn(resolveModule, "toSpaceRef").mockReturnValue({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  describe("updateContinuousAnnotationConfig", () => {
    beforeEach(() => {
      patch.mockResolvedValue({
        error: undefined,
        data: mockRawContinuousAnnotationConfig,
      });
    });

    it("calls PATCH with a continuous body", async () => {
      await updateContinuousAnnotationConfig({
        client: mockClient,
        annotationConfig: "ac_abc123",
        minimumScore: 0,
        maximumScore: 10,
      });

      expect(patch).toHaveBeenCalledTimes(1);
      expect(patch).toHaveBeenCalledWith(
        "/v2/annotation-configs/{annotation_config_id}",
        {
          params: { path: { annotation_config_id: "resolved-config-id" } },
          body: {
            annotation_config_type: "CONTINUOUS",
            name: undefined,
            minimum_score: 0,
            maximum_score: 10,
            optimization_direction: undefined,
          },
        },
      );
    });

    it("throws when API returns error", async () => {
      patch.mockResolvedValue({
        error: { detail: "not found", title: "Error" },
        data: undefined,
      });

      await expect(
        updateContinuousAnnotationConfig({
          client: mockClient,
          annotationConfig: "ac_abc123",
          name: "x",
        }),
      ).rejects.toThrow("not found");
    });
  });

  describe("updateCategoricalAnnotationConfig", () => {
    beforeEach(() => {
      patch.mockResolvedValue({
        error: undefined,
        data: mockRawCategoricalAnnotationConfig,
      });
    });

    it("calls PATCH with a categorical body", async () => {
      await updateCategoricalAnnotationConfig({
        client: mockClient,
        annotationConfig: "Accuracy",
        name: "Accuracy v2",
        values: [
          { label: "accurate", score: 1 },
          { label: "inaccurate", score: 0 },
        ],
        optimizationDirection: "MAXIMIZE",
      });

      expect(patch).toHaveBeenCalledTimes(1);
      expect(patch).toHaveBeenCalledWith(
        "/v2/annotation-configs/{annotation_config_id}",
        {
          params: { path: { annotation_config_id: "resolved-config-id" } },
          body: {
            annotation_config_type: "CATEGORICAL",
            name: "Accuracy v2",
            values: [
              { label: "accurate", score: 1 },
              { label: "inaccurate", score: 0 },
            ],
            optimization_direction: "MAXIMIZE",
          },
        },
      );
    });

    it("returns a transformed annotation config", async () => {
      const result = await updateCategoricalAnnotationConfig({
        client: mockClient,
        annotationConfig: "Accuracy",
        name: "Accuracy v2",
      });

      expect(result).toEqual({
        id: "ac_abc123",
        name: "Accuracy",
        createdAt: new Date("2024-01-15T00:00:00Z"),
        spaceId: "spc_xyz789",
        type: "CATEGORICAL",
        values: [
          { label: "accurate", score: 1 },
          { label: "inaccurate", score: 0 },
        ],
        optimizationDirection: "MAXIMIZE",
      });
    });

    it("throws when API returns error", async () => {
      patch.mockResolvedValue({
        error: { detail: "not found", title: "Error" },
        data: undefined,
      });

      await expect(
        updateCategoricalAnnotationConfig({
          client: mockClient,
          annotationConfig: "Accuracy",
          name: "x",
        }),
      ).rejects.toThrow("not found");
    });
  });

  describe("updateFreeformAnnotationConfig", () => {
    beforeEach(() => {
      patch.mockResolvedValue({
        error: undefined,
        data: mockRawFreeformAnnotationConfig,
      });
    });

    it("calls PATCH with a freeform body", async () => {
      await updateFreeformAnnotationConfig({
        client: mockClient,
        annotationConfig: "ac_abc123",
        name: "Notes",
      });

      expect(patch).toHaveBeenCalledTimes(1);
      expect(patch).toHaveBeenCalledWith(
        "/v2/annotation-configs/{annotation_config_id}",
        {
          params: { path: { annotation_config_id: "resolved-config-id" } },
          body: {
            annotation_config_type: "FREEFORM",
            name: "Notes",
          },
        },
      );
    });

    it("throws when API returns error", async () => {
      patch.mockResolvedValue({
        error: { detail: "not found", title: "Error" },
        data: undefined,
      });

      await expect(
        updateFreeformAnnotationConfig({
          client: mockClient,
          annotationConfig: "ac_abc123",
          name: "x",
        }),
      ).rejects.toThrow("not found");
    });
  });
});
