import { describe, expect, it } from "vitest";
import { transformSpace } from "../utils";
import { mockSpace } from "./fixtures";

describe("transformSpace", () => {
  it("accepts a space response without organization_id", () => {
    const { organization_id: _organizationId, ...legacySpace } = mockSpace;
    const space = transformSpace(legacySpace);
    expect(space.id).toBe(mockSpace.id);
    expect(space.organizationId).toBeUndefined();
  });

  it("should transform the created_at field of a space to a date object", () => {
    const expectedResult = {
      id: mockSpace.id,
      organizationId: mockSpace.organization_id,
      name: mockSpace.name,
      description: mockSpace.description,
      isPrivate: mockSpace.is_private,
      createdAt: new Date(mockSpace.created_at),
    };
    const space = transformSpace(mockSpace);
    expect(space).toEqual(expectedResult);
  });
});
