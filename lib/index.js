var requireUncached = require("require-uncached");

module.exports = {
    middleware: requireUncached("./middleware/index.js")
}