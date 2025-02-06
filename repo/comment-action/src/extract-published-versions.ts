import ansiRegex from "ansi-regex";
import emojiRegex from "emoji-regex";

/**
 * Extracts published package versions from changeset publish output
 * @param publishOutput - The raw output from changeset publish command
 * @returns Array of package versions in format "@scope/name@version" or "name@version"
 */
export function extractPublishedVersions(publishOutput: string): string[] {
  const cleanOutput = publishOutput
    .replace(ansiRegex(), "")
    .replace(emojiRegex(), "")
    .replace(/\r\n/g, "\n");

  const successMarker = "success packages published successfully:";
  const startIndex = cleanOutput.toLowerCase().indexOf(successMarker);

  if (startIndex === -1) {
    return [];
  }

  const releasedPackages = cleanOutput
    .slice(startIndex + successMarker.length)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  console.log("Released packages:", releasedPackages);

  return releasedPackages;
}
