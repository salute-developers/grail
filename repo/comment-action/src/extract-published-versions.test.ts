import { describe, expect, test } from "vitest";
import { extractPublishedVersions } from "./extract-published-versions.js";

describe("extractPublishedVersions", () => {
  test("extracts versions from successful publish output", () => {
    const input = `
🦋  warn ===============================IMPORTANT!===============================
🦋  warn Packages will be released under the canary tag
🦋  warn ----------------------------------------------------------------------
🦋  info npm info @salutejs/eslint-config
🦋  info npm info @salutejs/prettier-config
🦋  info Publishing "@salutejs/eslint-config" at "0.0.0-canary-20250206093830"
🦋  success packages published successfully:
🦋  @salutejs/eslint-config@0.0.0-canary-20250206093830
🦋  @salutejs/prettier-config@0.0.0-canary-20250206093830
🦋  salute-config@0.0.0-canary-20250206093830`;

    const expected = [
      "@salutejs/eslint-config@0.0.0-canary-20250206093830",
      "@salutejs/prettier-config@0.0.0-canary-20250206093830",
      "salute-config@0.0.0-canary-20250206093830",
    ];

    expect(extractPublishedVersions(input)).toEqual(expected);
  });

  test("extracts versions from butterfly-prefixed success message", () => {
    const input = `
🦋  warn ===============================IMPORTANT!===============================
🦋  warn Packages will be released under the canary tag
🦋  warn ----------------------------------------------------------------------
🦋  info npm info @salutejs/eslint-config
🦋  info npm info @salutejs/prettier-config
🦋  info Publishing "@salutejs/eslint-config" at "0.0.0-canary-20250206093830"
success packages published successfully:
🦋  @salutejs/eslint-config@0.0.0-canary-20250206093830
🦋  @salutejs/prettier-config@0.0.0-canary-20250206093830
🦋  salute-config@0.0.0-canary-20250206093830`;

    const expected = [
      "@salutejs/eslint-config@0.0.0-canary-20250206093830",
      "@salutejs/prettier-config@0.0.0-canary-20250206093830",
      "salute-config@0.0.0-canary-20250206093830",
    ];

    expect(extractPublishedVersions(input)).toEqual(expected);
  });

  test("returns empty array when no success marker found", () => {
    const input = `
🦋  warn ===============================IMPORTANT!===============================
🦋  warn Packages will be released under the canary tag
🦋  error Failed to publish packages`;

    expect(extractPublishedVersions(input)).toEqual([]);
  });

  test("returns empty array for empty input", () => {
    expect(extractPublishedVersions("")).toEqual([]);
  });

  test("handles single package publish", () => {
    const input = `
🦋  success packages published successfully:
🦋  @salutejs/eslint-config@0.0.0-canary-20250206093830`;

    const expected = ["@salutejs/eslint-config@0.0.0-canary-20250206093830"];

    expect(extractPublishedVersions(input)).toEqual(expected);
  });

  test("handles actual CI output", () => {
    const input = `> grail@ changeset /home/runner/work/grail/grail
> changeset "publish" "--tag" "canary" "--no-git-tag" "--snapshot"

🦋  info npm info @salutejs/eslint-config
🦋  info npm info @salutejs/prettier-config
🦋  info @salutejs/eslint-config is being published because our local version (0.0.0-canary-20250206142539) has not been published on npm
🦋  info @salutejs/prettier-config is being published because our local version (0.0.0-canary-20250206142539) has not been published on npm
🦋  info Publishing "@salutejs/eslint-config" at "0.0.0-canary-20250206142539"
🦋  info Publishing "@salutejs/prettier-config" at "0.0.0-canary-20250206142539"
🦋  success packages published successfully:
🦋  @salutejs/eslint-config@0.0.0-canary-20250206142539
🦋  @salutejs/prettier-config@0.0.0-canary-20250206142539`;

    const expected = [
      "@salutejs/eslint-config@0.0.0-canary-20250206142539",
      "@salutejs/prettier-config@0.0.0-canary-20250206142539",
    ];

    expect(extractPublishedVersions(input)).toEqual(expected);
  });
});
