/* config/eslint/index.js */

const projectName = "my-rules";

const fs = require("fs");
const path = require("path");

const ruleFiles = fs.readdirSync(__dirname).filter((file) => file !== "index.js" && !file.endsWith("test.js"));

const configs = {
    all: {
        plugins: [projectName],
        rules: Object.fromEntries(ruleFiles.map((file) => [`${projectName}/${path.basename(file, ".js")}`, "error"])),
    },
};

const rules = Object.fromEntries(ruleFiles.map((file) => [path.basename(file, ".js"), require("./" + file)]));

module.exports = { configs, rules };
