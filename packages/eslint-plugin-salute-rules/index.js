const fs = require('fs');
const path = require('path');

const projectName = 'salute-rules';

const ruleFiles = fs
    .readdirSync(path.join(__dirname, 'rules'))
    .filter((file) => !['index.js', 'helpers.js'].includes(file) && !file.endsWith('test.js'))
    .map((file) => path.join('./rules', file));

const configs = {
    all: {
        plugins: [projectName],
        rules: Object.fromEntries(ruleFiles.map((file) => [`${projectName}/${path.basename(file, '.js')}`, 'error'])),
    },
};

const rules = Object.fromEntries(ruleFiles.map((file) => [path.basename(file, '.js'), require('./' + file)]));

module.exports = { configs, rules };
