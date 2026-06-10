import { afterEach, describe, expect, it, vi } from "vitest";

import { createClient } from "../client";
import { ARIZE_SDK_VERSION } from "../__generated__/version/version.generated";

describe("createClient identity headers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the SDK identity headers on every request", async () => {
    let captured: Request | undefined;
    const fetchMock = vi.fn((request: Request) => {
      captured = request;
      return Promise.resolve(
        new Response("{}", {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = createClient({ apiKey: "test-key" });
    await client.GET("/v2/organizations", { params: { query: {} } });

    expect(fetchMock).toHaveBeenCalledOnce();
    const headers = captured?.headers;
    expect(headers?.get("sdk-language")).toBe("javascript");
    expect(headers?.get("sdk-version")).toBe(ARIZE_SDK_VERSION);
    expect(headers?.get("sdk-package-name")).toBe("@arizeai/ax-client");
    expect(headers?.get("language-version")).toBe(process.version);
  });
});
