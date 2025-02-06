import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/legacy.ts"],
        outDir: "dist",
        format: "cjs",
    },
    {
        entry: ["src/flat.ts"],
        outDir: "dist",
        format: "esm",
    },
]);
