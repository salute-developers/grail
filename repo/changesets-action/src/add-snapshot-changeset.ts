import { glob } from "glob";
import fs from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";

export async function findPublicPackageNames(
  commitMessage: string,
): Promise<void> {
  const packageJsonFiles = await glob("**/package.json", {
    ignore: "**/node_modules/**",
  });
  const packageNames: string[] = [];

  for (const file of packageJsonFiles) {
    try {
      const content = await fs.readFile(file, "utf-8");
      const packageConfig = JSON.parse(content);
      if (packageConfig.private !== true) {
        if (packageConfig.name) {
          packageNames.push(`"${packageConfig.name}": minor`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  if (packageNames.length === 0) {
    throw new Error("No public packages found");
  }

  const gitFileList = execSync("git ls-files --others --exclude-standard", {
    encoding: "utf-8",
  });

  const untracked = gitFileList.split("\n").filter(Boolean);

  const changesetFile = untracked.find((file) =>
    file.startsWith(".changeset/"),
  );

  if (!changesetFile) {
    throw new Error("No untracked changeset file found");
  }

  const output = `---
${packageNames.join("\n")}
---

${commitMessage}
`;

  const filePath = path.resolve(changesetFile);

  console.log("Writing to file:", filePath);

  await fs.writeFile(filePath, output, "utf-8");

  console.log("Changeset:");

  console.log(output);
}
