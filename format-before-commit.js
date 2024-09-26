module.exports = class TestPlugin {
    constructor() {
        this.name = 'format-before-commit';
    }

    /**
     * Tap into auto plugin points.
     * @param {import('@auto-it/core').default} auto
     */
    apply(auto) {
        auto.hooks.beforeCommitChangelog.tapAsync('FormatBeforeCommit', async () => {
            const { exec } = require('child_process');
            const { promisify } = require('util');

            const execAsync = promisify(exec);

            const { stderr, stdout } = await execAsync('npm run fmt');

            if (stderr) {
                console.error(stderr);
                process.exit(1);
            }

            if (stdout) {
                console.log(stdout);
            }
        });
    }
};
