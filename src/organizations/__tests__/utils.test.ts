import { describe, expect, it } from "vitest";
import { transformOrganization } from "../utils";
import { mockOrganization } from "./fixtures";

describe("transformOrganization", () => {
  it("should transform the created_at field of an organization to a date object", () => {
    const expectedResult = {
      id: mockOrganization.id,
      name: mockOrganization.name,
      description: mockOrganization.description,
      createdAt: new Date(mockOrganization.created_at),
    };
    const org = transformOrganization(mockOrganization);
    expect(org).toEqual(expectedResult);
  });
});
