import { describe, expect, it } from "vitest";
import { isBase64Id, isResourceId, toSpaceRef } from "../resolve";
import { resolveSpace } from "../space";

describe("resolveSpace", () => {
  it("should return both undefined when space is undefined", () => {
    expect(resolveSpace(undefined)).toEqual({
      spaceId: undefined,
      spaceName: undefined,
    });
  });

  it("should treat base64-encoded resource IDs as space IDs", () => {
    // "U3BhY2U6OTA1MDoxSmtS" decodes to "Space:9050:1JkR" (contains a colon)
    expect(resolveSpace("U3BhY2U6OTA1MDoxSmtS")).toEqual({
      spaceId: "U3BhY2U6OTA1MDoxSmtS",
      spaceName: undefined,
    });
  });

  it("should treat other values as a space name", () => {
    expect(resolveSpace("my-space")).toEqual({
      spaceId: undefined,
      spaceName: "my-space",
    });
  });

  it("should treat non-base64 values as space names", () => {
    expect(resolveSpace("not-base64!@#$")).toEqual({
      spaceId: undefined,
      spaceName: "not-base64!@#$",
    });
  });

  it("should treat base64 strings without colons as space names", () => {
    // base64 of "helloworld" has no colon
    expect(resolveSpace("aGVsbG93b3JsZA==")).toEqual({
      spaceId: undefined,
      spaceName: "aGVsbG93b3JsZA==",
    });
  });
});

describe("isBase64Id", () => {
  it("returns true for valid base64 that decodes to a string with a colon", () => {
    // "Space:9050:1JkR" encodes to "U3BhY2U6OTA1MDoxSmtS"
    expect(isBase64Id("U3BhY2U6OTA1MDoxSmtS")).toBe(true);
    // "Model:1:abcd" encodes to "TW9kZWw6MTphYmNk"
    expect(isBase64Id("TW9kZWw6MTphYmNk")).toBe(true);
  });

  it("returns false for valid base64 that decodes to a string without a colon", () => {
    // "helloworld" has no colon
    expect(isBase64Id("aGVsbG93b3JsZA==")).toBe(false);
  });

  it("returns false for invalid base64", () => {
    expect(isBase64Id("not-base64!@#$")).toBe(false);
    expect(isBase64Id("my-space-name")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isBase64Id("")).toBe(false);
  });
});

describe("isResourceId", () => {
  it("returns true for base64-encoded resource IDs", () => {
    expect(isResourceId("U3BhY2U6OTA1MDoxSmtS")).toBe(true);
  });

  it("returns false for plain names", () => {
    expect(isResourceId("my-space")).toBe(false);
    expect(isResourceId("production")).toBe(false);
  });

  it("returns false for base64 without a colon", () => {
    expect(isResourceId("aGVsbG93b3JsZA==")).toBe(false);
  });
});

describe("toSpaceRef", () => {
  it("returns an empty ref for undefined", () => {
    expect(toSpaceRef(undefined)).toEqual({});
  });

  it("returns spaceId for a base64-encoded resource ID", () => {
    expect(toSpaceRef("U3BhY2U6OTA1MDoxSmtS")).toEqual({
      spaceId: "U3BhY2U6OTA1MDoxSmtS",
    });
  });

  it("returns spaceName for a plain name", () => {
    expect(toSpaceRef("my-space")).toEqual({ spaceName: "my-space" });
  });

  it("returns spaceName for base64 that does not decode to a resource ID", () => {
    expect(toSpaceRef("aGVsbG93b3JsZA==")).toEqual({
      spaceName: "aGVsbG93b3JsZA==",
    });
  });

  it("returns spaceName for strings with special characters", () => {
    expect(toSpaceRef("my space with spaces")).toEqual({
      spaceName: "my space with spaces",
    });
  });
});
