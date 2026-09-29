import { expect, vi } from "vitest";

/**
 * Captures console.warn and returns a check that the alpha warning for
 * `functionName` fired. `warnPreRelease` warns once per function per process,
 * so call this in the first test of a file that exercises that function.
 */
export function captureAlphaWarning(functionName: string) {
  vi.stubEnv("DISABLE_PRERELEASE_WARNING", "");
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  return () => {
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]![0]).toContain(`[ALPHA] ${functionName}`);
    warn.mockRestore();
    vi.unstubAllEnvs();
  };
}
