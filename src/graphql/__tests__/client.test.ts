import nock from "nock";
import { describe, expect, it, afterEach } from "vitest";
import { graphqlFetch } from "../client";

const BASE_URL = "https://app.arize.com";
const DEFAULT_OPTIONS = {
  apiKey: "test-api-key",
  baseUrl: BASE_URL,
};

afterEach(() => {
  nock.cleanAll();
});

describe("graphqlFetch", () => {
  it("returns data on a successful response", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, { data: { node: { id: "123" } } });

    const result = await graphqlFetch<{ node: { id: string } }>(
      DEFAULT_OPTIONS,
      "{ node(id: \"123\") { id } }",
    );

    expect(result).toEqual({ node: { id: "123" } });
  });

  it("throws on GraphQL errors returned in a 200 response", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .reply(200, { errors: [{ message: "Not found" }] });

    await expect(
      graphqlFetch(DEFAULT_OPTIONS, "{ node(id: \"bad\") { id } }"),
    ).rejects.toThrow("GraphQL errors: Not found");
  });

  it("throws on HTTP error status", async () => {
    nock(BASE_URL).post("/graphql").reply(500, "Internal Server Error");

    await expect(
      graphqlFetch(DEFAULT_OPTIONS, "{ node(id: \"123\") { id } }"),
    ).rejects.toThrow("status 500");
  });

  it("sends x-api-key header and not Authorization header", async () => {
    nock(BASE_URL)
      .post("/graphql")
      .matchHeader("x-api-key", "test-api-key")
      .reply(200, { data: { node: { id: "456" } } });

    const result = await graphqlFetch<{ node: { id: string } }>(
      DEFAULT_OPTIONS,
      "{ node(id: \"456\") { id } }",
    );

    expect(result).toEqual({ node: { id: "456" } });
  });

  it("does not send an Authorization header", async () => {
    let capturedHeaders: Record<string, string> = {};

    nock(BASE_URL)
      .post("/graphql")
      .reply(function () {
        capturedHeaders = this.req.headers as Record<string, string>;
        return [200, { data: { ok: true } }];
      });

    await graphqlFetch<{ ok: boolean }>(DEFAULT_OPTIONS, "{ ok }");

    expect(capturedHeaders).not.toHaveProperty("authorization");
  });

  it("throws when apiKey is missing and env var is not set", async () => {
    const originalKey = process.env.ARIZE_API_KEY;
    delete process.env.ARIZE_API_KEY;

    try {
      await expect(
        graphqlFetch({ baseUrl: BASE_URL }, "{ node(id: \"1\") { id } }"),
      ).rejects.toThrow("ARIZE_API_KEY");
    } finally {
      if (originalKey !== undefined) {
        process.env.ARIZE_API_KEY = originalKey;
      }
    }
  });
});
