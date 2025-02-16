import * as core from "@actions/core";
import * as github from "@actions/github";
import { extractPublishedVersions } from "./extract-published-versions.js";

try {
  const publishOutput = core.getInput("publish-output", { required: true });
  const publishedVersions = extractPublishedVersions(publishOutput);

  core.setOutput("versions", publishedVersions);

  const firstPackage = publishedVersions.at(0);

  if (!firstPackage) {
    core.info("No published versions found in the output");

    process.exit(0);
  }

  const token = core.getInput("github-token", { required: true });
  const octokit = github.getOctokit(token);

  const version = firstPackage.split("@").pop();

  const commentBody = `## 📦 Snapshot Release\n\n\`\`\`\n${version}\n\`\`\`\n\nThe following packages have been published:\n\n${publishedVersions.map((v) => `\`\`\`\n${v}\n\`\`\``).join("\n")}`;

  const { data: comments } = await octokit.rest.issues.listComments({
    ...github.context.repo,
    issue_number: github.context.issue.number,
  });

  const botComment = comments.find(
    (comment) =>
      comment.user?.type === "Bot" &&
      comment.body?.includes("## 📦 Snapshot Release"),
  );

  if (botComment) {
    await octokit.rest.issues.updateComment({
      ...github.context.repo,
      comment_id: botComment.id,
      body: commentBody,
    });
  } else {
    await octokit.rest.issues.createComment({
      ...github.context.repo,
      issue_number: github.context.issue.number,
      body: commentBody,
    });
  }
} catch (error) {
  if (error instanceof Error) {
    core.setFailed(error.message);
  } else {
    core.setFailed("An unexpected error occurred");
  }
}
