import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { findPublicPackageNames } from "./add-snapshot-changeset.js";
import { glob } from "glob";
import fs from "node:fs/promises";
import { execSync } from "node:child_process";
import type { Mock } from "vitest";
import type { PathLike } from "node:fs";
import path from "node:path";

vi.mock("glob");
vi.mock("node:fs/promises");
vi.mock("node:child_process");
vi.mock("node:path");

describe("findPublicPackageNames", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create a changeset file with package versions and commit message", async () => {
    // Mock glob to return package.json files
    vi.mocked(glob).mockResolvedValue([
      "package1/package.json",
      "package2/package.json",
      "private-package/package.json",
    ]);

    // Mock fs.readFile for different package.json contents
    vi.mocked(fs.readFile).mockImplementation(
      async (filePath: PathLike | fs.FileHandle, options?: any) => {
        const files: Record<string, string> = {
          "package1/package.json": JSON.stringify({
            name: "@scope/package1",
            private: false,
          }),
          "package2/package.json": JSON.stringify({
            name: "@scope/package2",
            private: false,
          }),
          "private-package/package.json": JSON.stringify({
            name: "@scope/private-package",
            private: true,
          }),
        };
        return files[filePath.toString()] || "";
      },
    );

    // Mock git commands
    vi.mocked(execSync).mockImplementation((cmd: string) => {
      if (cmd === "git ls-files --others --exclude-standard") {
        return ".changeset/temp-changeset.md";
      }
      if (cmd === "git log -1 --pretty=%B") {
        return "test: mock commit message";
      }
      return "";
    });

    // Mock fs.writeFile
    vi.mocked(fs.writeFile).mockResolvedValue();

    vi.mocked(path.resolve).mockImplementation(
      (filePath: string) => `/resolved/${filePath}`,
    );

    await findPublicPackageNames("test: mock commit message");

    // Verify glob was called correctly
    expect(glob).toHaveBeenCalledWith("**/package.json", {
      ignore: "**/node_modules/**",
    });

    // Verify fs.readFile was called for each package.json
    expect(fs.readFile).toHaveBeenCalledTimes(3);

    // Verify fs.writeFile was called with correct content
    expect(fs.writeFile).toHaveBeenCalledWith(
      "/resolved/.changeset/temp-changeset.md",
      `---
"@scope/package1": minor
"@scope/package2": minor
---

test: mock commit message
`,
      "utf-8",
    );
  });

  it("should handle errors when reading package.json", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error") as Mock;

    vi.mocked(glob).mockResolvedValue(["invalid/package.json"]);
    vi.mocked(fs.readFile).mockRejectedValue(new Error("Failed to read file"));

    await expect(
      findPublicPackageNames("test: mock commit message"),
    ).rejects.toThrow("No public packages found");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error processing invalid/package.json:",
      expect.any(Error),
    );
  });

  it("should throw error when no public packages are found", async () => {
    vi.mocked(glob).mockResolvedValue(["package1/package.json"]);
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        name: "@scope/package1",
        private: true,
      }),
    );

    await expect(
      findPublicPackageNames("test: mock commit message"),
    ).rejects.toThrow("No public packages found");
  });

  it("should throw error when no untracked changeset file is found", async () => {
    vi.mocked(glob).mockResolvedValue(["package1/package.json"]);
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        name: "@scope/package1",
        private: false,
      }),
    );
    vi.mocked(execSync).mockImplementation((cmd: string) => {
      if (cmd === "git ls-files --others --exclude-standard") {
        return ""; // No untracked files
      }
      return "test: mock commit message";
    });

    await expect(
      findPublicPackageNames("test: mock commit message"),
    ).rejects.toThrow("No untracked changeset file found");
  });

  it("should handle multiple untracked files and use first .changeset file", async () => {
    vi.mocked(glob).mockResolvedValue(["package1/package.json"]);
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        name: "@scope/package1",
        private: false,
      }),
    );
    vi.mocked(execSync).mockImplementation((cmd: string) => {
      if (cmd === "git ls-files --others --exclude-standard") {
        return "some-file.txt\n.changeset/abc.md\n.changeset/xyz.md";
      }
      return "test: mock commit message";
    });

    vi.mocked(path.resolve).mockImplementation(
      (filePath: string) => `/resolved/${filePath}`,
    );

    await findPublicPackageNames("test: mock commit message");

    expect(fs.writeFile).toHaveBeenCalledWith(
      "/resolved/.changeset/abc.md",
      expect.any(String),
      "utf-8",
    );
  });
});
