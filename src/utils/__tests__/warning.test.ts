import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const PRERELEASE_VERSION = "1.0.0-alpha.1";
const STABLE_VERSION = "1.2.0";
const TEST_FUNCTION_NAME = "test-function";
const DISABLE_PRERELEASE_WARNING = "DISABLE_PRERELEASE_WARNING";

describe("warnPreRelease", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("does not warn when version is not a pre-release", async () => {
    vi.doMock("../../../package.json", () => ({
      default: { version: STABLE_VERSION },
    }));
    const { warnPreRelease } = await import("../warning");
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnPreRelease({ functionName: TEST_FUNCTION_NAME });

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("warns when version is a pre-release", async () => {
    vi.doMock("../../../package.json", () => ({
      default: { version: PRERELEASE_VERSION },
    }));
    const { warnPreRelease } = await import("../warning");
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnPreRelease({ functionName: TEST_FUNCTION_NAME });

    expect(consoleSpy).toHaveBeenCalledOnce();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(TEST_FUNCTION_NAME),
    );
    consoleSpy.mockRestore();
  });

  it("warns only once across multiple calls", async () => {
    vi.doMock("../../../package.json", () => ({
      default: { version: PRERELEASE_VERSION },
    }));
    const { warnPreRelease } = await import("../warning");
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnPreRelease({ functionName: TEST_FUNCTION_NAME });
    warnPreRelease({ functionName: TEST_FUNCTION_NAME });
    warnPreRelease({ functionName: TEST_FUNCTION_NAME });

    expect(consoleSpy).toHaveBeenCalledOnce();
    consoleSpy.mockRestore();
  });

  it("does not warn when DISABLE_PRERELEASE_WARNING is true", async () => {
    vi.doMock("../../../package.json", () => ({
      default: { version: PRERELEASE_VERSION },
    }));
    process.env[DISABLE_PRERELEASE_WARNING] = "true";
    const { warnPreRelease } = await import("../warning");
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnPreRelease({ functionName: TEST_FUNCTION_NAME });

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
