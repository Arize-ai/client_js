import packageJson from "../../package.json";

const ARIZE_SDK_VERSION = packageJson.version;
const DISABLE_PRERELEASE_WARNING = "DISABLE_PRERELEASE_WARNING";

const isPreRelease = /-(alpha|beta|rc|pre)/i.test(ARIZE_SDK_VERSION);

let hasWarnedPreRelease = false;

const isPreReleaseWarningDisabled = (): boolean => {
  if (typeof process !== "object" || typeof process.env !== "object") {
    return false;
  }
  return process.env[DISABLE_PRERELEASE_WARNING] === "true";
};

interface WarningOptions {
  /**
   * The name of the function being called.
   */
  functionName: string;

  /**
   * A custom version override.
   */
  version?: string;
}

/**
 * Logs a pre-release warning for SDK functions.
 *
 * @param functionName - The name of the function being called.
 * @param version - A custom version override.
 */
export function warnPreRelease({
  functionName,
  version = ARIZE_SDK_VERSION,
}: WarningOptions): void {
  if (!isPreRelease || hasWarnedPreRelease || isPreReleaseWarningDisabled()) {
    return;
  }

  hasWarnedPreRelease = true;

  // eslint-disable-next-line no-console
  console.warn(
    `[Arize AX Client] ${functionName} is part of version ${version} - API may change. Set ${DISABLE_PRERELEASE_WARNING}=true to disable this warning.`,
  );
}
