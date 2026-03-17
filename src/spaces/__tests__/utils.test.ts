import { describe, expect, it } from "vitest";
import { transformSpace } from "../utils";
import { mockSpace } from "./fixtures";

describe("transformSpace", () => {
  it("should transform the created_at field of a space to a date object", () => {
    const expectedResult = {
      id: mockSpace.id,
      name: mockSpace.name,
      description: mockSpace.description,
      createdAt: new Date(mockSpace.created_at),
    };
    const space = transformSpace(mockSpace);
    expect(space).toEqual(expectedResult);
  });
});
