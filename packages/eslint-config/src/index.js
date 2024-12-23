const { version } = require("../package.json")

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        name: "@salutejs/eslint-config",
        version
    },
    configs: {
        all: require("./configs/eslint-all")
    }
}