import { describe, expect, it } from "vitest";
import { transformResourceRestriction } from "../utils";
import { mockResourceRestriction } from "./fixtures";

describe("transformResourceRestriction", () => {
  it("should transform snake_case fields and dates", () => {
    const restriction = transformResourceRestriction(mockResourceRestriction);
    expect(restriction).toEqual({
      resourceType: mockResourceRestriction.resource_type,
      resourceId: mockResourceRestriction.resource_id,
      createdAt: new Date(mockResourceRestriction.created_at),
    });
  });

  it("should convert created_at string to a Date instance", () => {
    const restriction = transformResourceRestriction(mockResourceRestriction);
    expect(restriction.createdAt).toBeInstanceOf(Date);
  });
});
