import * as core from "@actions/core";
import { findPublicPackageNames } from "./add-snapshot-changeset.js";

try {
  await findPublicPackageNames("snapshot");
  core.info("Successfully created snapshot changeset");
} catch (error) {
  if (error instanceof Error) {
    core.setFailed(error.message);
  } else {
    core.setFailed("An unexpected error occurred");
  }
}
