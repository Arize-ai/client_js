import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, "../package.json");
const outputPath = path.resolve(
  __dirname,
  "../src/__generated__/version/version.generated.ts",
);

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const output = `/**
 * Auto-generated from package version.
 * Keep this file in sync with package.json.
 */
export const ARIZE_SDK_VERSION = "${packageJson.version}"; // x-release-please-version
`;

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, output, "utf8");
