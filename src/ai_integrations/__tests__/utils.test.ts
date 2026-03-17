import { describe, expect, it } from "vitest";
import { toRawScoping, transformAiIntegration } from "../utils";
import { mockAiIntegration } from "./fixtures";

describe("transformAiIntegration", () => {
  it("should convert created_at and updated_at strings to Date objects", () => {
    const result = transformAiIntegration(mockAiIntegration);
    expect(result.createdAt).toEqual(new Date(mockAiIntegration.created_at));
    expect(result.updatedAt).toEqual(new Date(mockAiIntegration.updated_at));
  });

  it("should map snake_case fields to camelCase", () => {
    const result = transformAiIntegration(mockAiIntegration);
    expect(result.hasApiKey).toBe(mockAiIntegration.has_api_key);
    expect(result.enableDefaultModels).toBe(
      mockAiIntegration.enable_default_models,
    );
    expect(result.functionCallingEnabled).toBe(
      mockAiIntegration.function_calling_enabled,
    );
    expect(result.authType).toBe(mockAiIntegration.auth_type);
    expect(result.createdByUserId).toBe(mockAiIntegration.created_by_user_id);
  });

  it("should map scoping snake_case fields to camelCase", () => {
    const result = transformAiIntegration(mockAiIntegration);
    expect(result.scopings).toEqual([{ organizationId: null, spaceId: null }]);
  });

  it("should pass through id, name, provider, modelNames unchanged", () => {
    const result = transformAiIntegration(mockAiIntegration);
    expect(result.id).toBe(mockAiIntegration.id);
    expect(result.name).toBe(mockAiIntegration.name);
    expect(result.provider).toBe(mockAiIntegration.provider);
    expect(result.modelNames).toEqual(mockAiIntegration.model_names);
  });
});

describe("toRawScoping", () => {
  it("should map camelCase scoping fields to snake_case", () => {
    const orgId = "QWNjb3VudE9yZzoxMjM6YUJjRA==";
    const spaceId = "U3BhY2U6NDU2OmRlZg==";
    expect(toRawScoping({ organizationId: orgId, spaceId })).toEqual({
      organization_id: orgId,
      space_id: spaceId,
    });
  });

  it("should pass through null values", () => {
    expect(toRawScoping({ organizationId: null, spaceId: null })).toEqual({
      organization_id: null,
      space_id: null,
    });
  });
});
