const { version } = require("../package.json")

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = [{
    configs: {
        all: require("./configs/eslint-all")
    }
}]