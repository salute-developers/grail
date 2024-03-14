const projectName = 'salute-rules';

const fs = require('fs');
const path = require('path');

const ruleFiles = fs
    .readdirSync(__dirname)
    .filter((file) => !['index.js', 'helpers.js'].includes(file) && !file.endsWith('test.js'));

const configs = {
    all: {
        plugins: [projectName],
        rules: Object.fromEntries(ruleFiles.map((file) => [`${projectName}/${path.basename(file, '.js')}`, 'error'])),
    },
};

const rules = Object.fromEntries(ruleFiles.map((file) => [path.basename(file, '.js'), require('./' + file)]));

module.exports = { configs, rules };
