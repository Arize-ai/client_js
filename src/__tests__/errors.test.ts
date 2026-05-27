import { describe, expect, it } from "vitest";
import {
  AmbiguousNameError,
  APIError,
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
  NotFoundError,
  handleApiError,
} from "../errors";

describe("AuthenticationError", () => {
  it("should include the status code in the message", () => {
    const err = new AuthenticationError(401, "api key is invalid");
    expect(err.statusCode).toBe(401);
    expect(err.message).toContain("HTTP 401");
    expect(err.message).toContain("Verify your API key");
    expect(err.name).toBe("AuthenticationError");
  });

  it("should be an instance of Error", () => {
    const err = new AuthenticationError(401, "unauthorized");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AuthenticationError);
  });
});

describe("AuthorizationError", () => {
  it("should include the status code in the message", () => {
    const err = new AuthorizationError(403, "forbidden");
    expect(err.statusCode).toBe(403);
    expect(err.message).toContain("HTTP 403");
    expect(err.message).toContain("permission");
    expect(err.name).toBe("AuthorizationError");
  });

  it("should be an instance of Error but not AuthenticationError", () => {
    const err = new AuthorizationError(403, "forbidden");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AuthorizationError);
    expect(err).not.toBeInstanceOf(AuthenticationError);
  });
});

describe("APIError", () => {
  it("should include the status code in the message", () => {
    const err = new APIError(422, "validation failed");
    expect(err.statusCode).toBe(422);
    expect(err.message).toContain("HTTP 422");
    expect(err.message).toContain("validation failed");
    expect(err.name).toBe("APIError");
  });

  it("should be an instance of Error", () => {
    const err = new APIError(500, "internal server error");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(APIError);
  });
});

describe("BadRequestError", () => {
  it("should have statusCode 400 and correct name", () => {
    const err = new BadRequestError("invalid field");
    expect(err.statusCode).toBe(400);
    expect(err.message).toContain("HTTP 400");
    expect(err.message).toContain("invalid field");
    expect(err.name).toBe("BadRequestError");
  });

  it("should be an instance of APIError", () => {
    const err = new BadRequestError("invalid field");
    expect(err).toBeInstanceOf(APIError);
    expect(err).toBeInstanceOf(BadRequestError);
  });
});

describe("NotFoundError", () => {
  it("should have statusCode 404 and correct name", () => {
    const err = new NotFoundError("resource not found");
    expect(err.statusCode).toBe(404);
    expect(err.message).toContain("HTTP 404");
    expect(err.message).toContain("resource not found");
    expect(err.name).toBe("NotFoundError");
  });

  it("should be an instance of APIError", () => {
    const err = new NotFoundError("resource not found");
    expect(err).toBeInstanceOf(APIError);
    expect(err).toBeInstanceOf(NotFoundError);
  });
});

describe("AmbiguousNameError", () => {
  it("should include resource type, name, and IDs in the message", () => {
    const err = new AmbiguousNameError("space", "my-space", ["id1", "id2"]);
    expect(err.resourceType).toBe("space");
    expect(err.resourceName).toBe("my-space");
    expect(err.matchingIds).toEqual(["id1", "id2"]);
    expect(err.message).toContain("my-space");
    expect(err.message).toContain("id1");
    expect(err.message).toContain("id2");
    expect(err.name).toBe("AmbiguousNameError");
  });

  it("should be an instance of Error", () => {
    const err = new AmbiguousNameError("space", "my-space", ["id1", "id2"]);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AmbiguousNameError);
  });
});

describe("handleApiError", () => {
  const makeError = (status: number, detail?: string) => ({
    title: "Error title",
    status,
    detail,
  });

  it("should throw AuthenticationError on 401", () => {
    expect(() =>
      handleApiError({
        error: makeError(401, "api key is invalid"),
      }),
    ).toThrow(AuthenticationError);
  });

  it("should throw AuthorizationError on 403", () => {
    let thrown: AuthorizationError | undefined;
    try {
      handleApiError({ error: makeError(403, "Access denied") });
    } catch (e) {
      thrown = e as AuthorizationError;
    }
    expect(thrown).toBeInstanceOf(AuthorizationError);
    expect(thrown?.statusCode).toBe(403);
  });

  it("should throw BadRequestError on 400", () => {
    let thrown: BadRequestError | undefined;
    try {
      handleApiError({ error: makeError(400, "Invalid field") });
    } catch (e) {
      thrown = e as BadRequestError;
    }
    expect(thrown).toBeInstanceOf(BadRequestError);
    expect(thrown).toBeInstanceOf(APIError);
    expect(thrown?.statusCode).toBe(400);
  });

  it("should throw NotFoundError on 404", () => {
    let thrown: NotFoundError | undefined;
    try {
      handleApiError({ error: makeError(404) });
    } catch (e) {
      thrown = e as NotFoundError;
    }
    expect(thrown).toBeInstanceOf(NotFoundError);
    expect(thrown).toBeInstanceOf(APIError);
    expect(thrown?.statusCode).toBe(404);
  });

  it("should throw APIError on 500", () => {
    expect(() =>
      handleApiError({ error: makeError(500, "Something went wrong") }),
    ).toThrow(APIError);
  });

  it("should prefer detail over title in the error message", () => {
    expect(() =>
      handleApiError({ error: makeError(401, "custom detail message") }),
    ).toThrow("custom detail message");
  });

  it("should fall back to title when detail is absent", () => {
    expect(() => handleApiError({ error: makeError(404) })).toThrow(
      "Error title",
    );
  });

  it("403 should not be an AuthenticationError", () => {
    expect(() =>
      handleApiError({ error: makeError(403, "forbidden") }),
    ).not.toThrow(AuthenticationError);
  });
});
