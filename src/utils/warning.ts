import { ARIZE_SDK_VERSION } from "../__generated__/version/version.generated.js";

const DISABLE_PRERELEASE_WARNING = "DISABLE_PRERELEASE_WARNING";

const warnedKeys = new Set<string>();

const isPreReleaseWarningDisabled = (): boolean => {
  if (typeof process !== "object" || typeof process.env !== "object") {
    return false;
  }
  return process.env[DISABLE_PRERELEASE_WARNING] === "true";
};

interface WarningOptions {
  /**
   * The name of the function being called. Used as a deduplication key so the
   * warning fires at most once per function per process lifetime.
   */
  functionName: string;

  /**
   * The release stage of the endpoint.
   */
  stage: "alpha" | "beta";

  /**
   * A custom version override.
   */
  version?: string;
}

/**
 * Logs a one-time pre-release warning for SDK functions, keyed by function
 * name. Subsequent calls with the same functionName are no-ops.
 *
 * Mirrors the Python `prerelease_endpoint` decorator and the Go
 * `prerelease.Warn` helper: per-endpoint, stage-aware, consistent message.
 */
export function warnPreRelease({
  functionName,
  stage,
  version = ARIZE_SDK_VERSION,
}: WarningOptions): void {
  if (warnedKeys.has(functionName) || isPreReleaseWarningDisabled()) {
    return;
  }
  warnedKeys.add(functionName);
  const article = stage === "alpha" ? "an" : "a";
  // eslint-disable-next-line no-console
  console.warn(
    `[${stage.toUpperCase()}] ${functionName} is ${article} ${stage} API in Arize AX SDK v${version} and may change without notice. If you experience unexpected failures, please upgrade to the most recent version of the package. Set ${DISABLE_PRERELEASE_WARNING}=true to disable this warning.`,
  );
}
