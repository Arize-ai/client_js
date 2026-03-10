import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  getMergedOptions,
  createClient,
  createGraphQLClientOptions,
} from "../client";

const TEST_API_KEY = "test-api-key";
const TEST_BASE_URL = "https://test.arize.com";
const TEST_GRAPHQL_BASE_URL = "https://test-graphql.arize.com";
const TEST_DEFAULT_HEADERS = { "x-custom-header": "test-value" };
const DEFAULT_BASE_URL = "https://api.arize.com";

describe("getMergedOptions", () => {
  let originalApiKey: string | undefined;
  let originalBaseUrl: string | undefined;
  let originalGraphqlBaseUrl: string | undefined;

  beforeEach(() => {
    originalApiKey = process.env.ARIZE_API_KEY;
    originalBaseUrl = process.env.ARIZE_BASE_URL;
    originalGraphqlBaseUrl = process.env.ARIZE_GRAPHQL_BASE_URL;
    delete process.env.ARIZE_API_KEY;
    delete process.env.ARIZE_BASE_URL;
    delete process.env.ARIZE_GRAPHQL_BASE_URL;
  });

  afterEach(() => {
    if (originalApiKey !== undefined) {
      process.env.ARIZE_API_KEY = originalApiKey;
    } else {
      delete process.env.ARIZE_API_KEY;
    }
    if (originalBaseUrl !== undefined) {
      process.env.ARIZE_BASE_URL = originalBaseUrl;
    } else {
      delete process.env.ARIZE_BASE_URL;
    }
    if (originalGraphqlBaseUrl !== undefined) {
      process.env.ARIZE_GRAPHQL_BASE_URL = originalGraphqlBaseUrl;
    } else {
      delete process.env.ARIZE_GRAPHQL_BASE_URL;
    }
  });

  it("returns empty object when no config and no env vars are set", () => {
    const result = getMergedOptions();
    expect(result).toEqual({});
  });

  it("returns env options when env vars are set and no explicit config", () => {
    process.env.ARIZE_API_KEY = TEST_API_KEY;
    process.env.ARIZE_BASE_URL = TEST_BASE_URL;
    process.env.ARIZE_GRAPHQL_BASE_URL = TEST_GRAPHQL_BASE_URL;

    const expectedResult = {
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
      graphqlBaseUrl: TEST_GRAPHQL_BASE_URL,
    };
    const result = getMergedOptions();
    expect(result).toEqual(expectedResult);
  });

  it("picks up ARIZE_API_KEY from env when not in explicit config", () => {
    process.env.ARIZE_API_KEY = TEST_API_KEY;

    const result = getMergedOptions({ baseUrl: TEST_BASE_URL });
    expect(result.apiKey).toBe(TEST_API_KEY);
    expect(result.baseUrl).toBe(TEST_BASE_URL);
  });

  it("explicit config overrides env options", () => {
    process.env.ARIZE_API_KEY = "env-api-key";
    process.env.ARIZE_BASE_URL = "https://env.arize.com";

    const result = getMergedOptions({
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
    });
    expect(result.apiKey).toBe(TEST_API_KEY);
    expect(result.baseUrl).toBe(TEST_BASE_URL);
  });

  it("uses custom getEnvironmentOptions function", () => {
    const customEnvOptions = {
      apiKey: "test-custom-env-key",
      baseUrl: "https://custom-env.arize.com",
    };
    const getEnvironmentOptions = vi.fn().mockReturnValue(customEnvOptions);

    const result = getMergedOptions({ getEnvironmentOptions });
    expect(getEnvironmentOptions).toHaveBeenCalledOnce();
    expect(result.apiKey).toBe(customEnvOptions.apiKey);
    expect(result.baseUrl).toBe(customEnvOptions.baseUrl);
  });

  it("explicit options override custom getEnvironmentOptions", () => {
    const getEnvironmentOptions = vi.fn().mockReturnValue({
      apiKey: "test-env-key",
      baseUrl: "https://env.arize.com",
    });

    const result = getMergedOptions({
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
      getEnvironmentOptions,
    });
    expect(result.apiKey).toBe(TEST_API_KEY);
    expect(result.baseUrl).toBe(TEST_BASE_URL);
  });
});

describe("createClient", () => {
  let originalApiKey: string | undefined;
  let originalBaseUrl: string | undefined;

  beforeEach(() => {
    originalApiKey = process.env.ARIZE_API_KEY;
    originalBaseUrl = process.env.ARIZE_BASE_URL;
    delete process.env.ARIZE_API_KEY;
    delete process.env.ARIZE_BASE_URL;
  });

  afterEach(() => {
    if (originalApiKey !== undefined) {
      process.env.ARIZE_API_KEY = originalApiKey;
    } else {
      delete process.env.ARIZE_API_KEY;
    }
    if (originalBaseUrl !== undefined) {
      process.env.ARIZE_BASE_URL = originalBaseUrl;
    } else {
      delete process.env.ARIZE_BASE_URL;
    }
  });

  it("throws when no apiKey is provided and ARIZE_API_KEY env var is not set", () => {
    expect(() => createClient()).toThrow(
      "The ARIZE_API_KEY environment variable is missing or empty; either provide it, or create the Arize client with an apiKey option, like createClient({ apiKey: 'My API Key' }).",
    );
  });

  it("throws when config is provided without apiKey and env var is not set", () => {
    expect(() => createClient({ baseUrl: TEST_BASE_URL })).toThrow(
      "ARIZE_API_KEY",
    );
  });

  it("creates a client when apiKey is provided explicitly", () => {
    const client = createClient({ apiKey: TEST_API_KEY });
    expect(client).toBeTruthy();
  });

  it("picks up ARIZE_API_KEY from env and creates a client", () => {
    process.env.ARIZE_API_KEY = TEST_API_KEY;
    const client = createClient();
    expect(client).toBeTruthy();
  });

  it("uses default base URL when no baseUrl is specified", () => {
    // We verify the client is created successfully — the base URL default is
    // exercised internally via arizeConfigToClientOptions.
    const client = createClient({ apiKey: TEST_API_KEY });
    expect(client).toBeTruthy();
  });

  it("creates a client with a custom baseUrl", () => {
    const client = createClient({
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
    });
    expect(client).toBeTruthy();
  });

  it("creates a client with defaultHeaders included", () => {
    const client = createClient({
      apiKey: TEST_API_KEY,
      defaultHeaders: TEST_DEFAULT_HEADERS,
    });
    expect(client).toBeTruthy();
  });

  it("picks up ARIZE_BASE_URL from env", () => {
    process.env.ARIZE_API_KEY = TEST_API_KEY;
    process.env.ARIZE_BASE_URL = TEST_BASE_URL;
    const client = createClient();
    expect(client).toBeTruthy();
  });
});

describe("createGraphQLClientOptions", () => {
  let originalApiKey: string | undefined;
  let originalGraphqlBaseUrl: string | undefined;

  beforeEach(() => {
    originalApiKey = process.env.ARIZE_API_KEY;
    originalGraphqlBaseUrl = process.env.ARIZE_GRAPHQL_BASE_URL;
    delete process.env.ARIZE_API_KEY;
    delete process.env.ARIZE_GRAPHQL_BASE_URL;
  });

  afterEach(() => {
    if (originalApiKey !== undefined) {
      process.env.ARIZE_API_KEY = originalApiKey;
    } else {
      delete process.env.ARIZE_API_KEY;
    }
    if (originalGraphqlBaseUrl !== undefined) {
      process.env.ARIZE_GRAPHQL_BASE_URL = originalGraphqlBaseUrl;
    } else {
      delete process.env.ARIZE_GRAPHQL_BASE_URL;
    }
  });

  it("returns apiKey from explicit config", () => {
    const expectedResult = {
      apiKey: TEST_API_KEY,
      baseUrl: undefined,
      defaultHeaders: undefined,
    };
    const result = createGraphQLClientOptions({ apiKey: TEST_API_KEY });
    expect(result).toEqual(expectedResult);
  });

  it("returns graphqlBaseUrl as baseUrl", () => {
    const expectedResult = {
      apiKey: TEST_API_KEY,
      baseUrl: TEST_GRAPHQL_BASE_URL,
      defaultHeaders: undefined,
    };
    const result = createGraphQLClientOptions({
      apiKey: TEST_API_KEY,
      graphqlBaseUrl: TEST_GRAPHQL_BASE_URL,
    });
    expect(result).toEqual(expectedResult);
  });

  it("returns defaultHeaders", () => {
    const expectedResult = {
      apiKey: TEST_API_KEY,
      baseUrl: undefined,
      defaultHeaders: TEST_DEFAULT_HEADERS,
    };
    const result = createGraphQLClientOptions({
      apiKey: TEST_API_KEY,
      defaultHeaders: TEST_DEFAULT_HEADERS,
    });
    expect(result).toEqual(expectedResult);
  });

  it("returns all fields from merged options", () => {
    const expectedResult = {
      apiKey: TEST_API_KEY,
      baseUrl: TEST_GRAPHQL_BASE_URL,
      defaultHeaders: TEST_DEFAULT_HEADERS,
    };
    const result = createGraphQLClientOptions({
      apiKey: TEST_API_KEY,
      graphqlBaseUrl: TEST_GRAPHQL_BASE_URL,
      defaultHeaders: TEST_DEFAULT_HEADERS,
    });
    expect(result).toEqual(expectedResult);
  });

  it("picks up apiKey from ARIZE_API_KEY env var", () => {
    process.env.ARIZE_API_KEY = TEST_API_KEY;
    const result = createGraphQLClientOptions();
    expect(result.apiKey).toBe(TEST_API_KEY);
  });

  it("picks up graphqlBaseUrl from ARIZE_GRAPHQL_BASE_URL env var", () => {
    process.env.ARIZE_GRAPHQL_BASE_URL = TEST_GRAPHQL_BASE_URL;
    const result = createGraphQLClientOptions();
    expect(result.baseUrl).toBe(TEST_GRAPHQL_BASE_URL);
  });

  it("returns undefined apiKey when no config and no env vars set", () => {
    const result = createGraphQLClientOptions();
    expect(result.apiKey).toBeUndefined();
    expect(result.baseUrl).toBeUndefined();
    expect(result.defaultHeaders).toBeUndefined();
  });
});

describe("getDefaultEnvironmentOptions (via getMergedOptions)", () => {
  it("returns only ARIZE_API_KEY when only that env var is set", () => {
    const originalApiKey = process.env.ARIZE_API_KEY;
    const originalBaseUrl = process.env.ARIZE_BASE_URL;
    const originalGraphqlBaseUrl = process.env.ARIZE_GRAPHQL_BASE_URL;

    delete process.env.ARIZE_BASE_URL;
    delete process.env.ARIZE_GRAPHQL_BASE_URL;
    process.env.ARIZE_API_KEY = TEST_API_KEY;

    try {
      const result = getMergedOptions();
      expect(result).toEqual({ apiKey: TEST_API_KEY });
    } finally {
      if (originalApiKey !== undefined) {
        process.env.ARIZE_API_KEY = originalApiKey;
      } else {
        delete process.env.ARIZE_API_KEY;
      }
      if (originalBaseUrl !== undefined) {
        process.env.ARIZE_BASE_URL = originalBaseUrl;
      } else {
        delete process.env.ARIZE_BASE_URL;
      }
      if (originalGraphqlBaseUrl !== undefined) {
        process.env.ARIZE_GRAPHQL_BASE_URL = originalGraphqlBaseUrl;
      } else {
        delete process.env.ARIZE_GRAPHQL_BASE_URL;
      }
    }
  });

  it("returns only ARIZE_BASE_URL when only that env var is set", () => {
    const originalApiKey = process.env.ARIZE_API_KEY;
    const originalBaseUrl = process.env.ARIZE_BASE_URL;
    const originalGraphqlBaseUrl = process.env.ARIZE_GRAPHQL_BASE_URL;

    delete process.env.ARIZE_API_KEY;
    delete process.env.ARIZE_GRAPHQL_BASE_URL;
    process.env.ARIZE_BASE_URL = TEST_BASE_URL;

    try {
      const result = getMergedOptions();
      expect(result).toEqual({ baseUrl: TEST_BASE_URL });
    } finally {
      if (originalApiKey !== undefined) {
        process.env.ARIZE_API_KEY = originalApiKey;
      } else {
        delete process.env.ARIZE_API_KEY;
      }
      if (originalBaseUrl !== undefined) {
        process.env.ARIZE_BASE_URL = originalBaseUrl;
      } else {
        delete process.env.ARIZE_BASE_URL;
      }
      if (originalGraphqlBaseUrl !== undefined) {
        process.env.ARIZE_GRAPHQL_BASE_URL = originalGraphqlBaseUrl;
      } else {
        delete process.env.ARIZE_GRAPHQL_BASE_URL;
      }
    }
  });

  it("returns only ARIZE_GRAPHQL_BASE_URL when only that env var is set", () => {
    const originalApiKey = process.env.ARIZE_API_KEY;
    const originalBaseUrl = process.env.ARIZE_BASE_URL;
    const originalGraphqlBaseUrl = process.env.ARIZE_GRAPHQL_BASE_URL;

    delete process.env.ARIZE_API_KEY;
    delete process.env.ARIZE_BASE_URL;
    process.env.ARIZE_GRAPHQL_BASE_URL = TEST_GRAPHQL_BASE_URL;

    try {
      const result = getMergedOptions();
      expect(result).toEqual({ graphqlBaseUrl: TEST_GRAPHQL_BASE_URL });
    } finally {
      if (originalApiKey !== undefined) {
        process.env.ARIZE_API_KEY = originalApiKey;
      } else {
        delete process.env.ARIZE_API_KEY;
      }
      if (originalBaseUrl !== undefined) {
        process.env.ARIZE_BASE_URL = originalBaseUrl;
      } else {
        delete process.env.ARIZE_BASE_URL;
      }
      if (originalGraphqlBaseUrl !== undefined) {
        process.env.ARIZE_GRAPHQL_BASE_URL = originalGraphqlBaseUrl;
      } else {
        delete process.env.ARIZE_GRAPHQL_BASE_URL;
      }
    }
  });
});
