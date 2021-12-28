const path = require("path")

module.exports = env => {
    if (!env || !env.moduleName) {
        console.error("No module name given!\nPlease specify a module name with the --env.moduleName tag\n")
        process.exit(1)
    }

    return {
        entry: "./" + env.moduleName + "/src/index.js",
        output: {
            filename: "main.js",
            path: path.resolve(__dirname, 'dist')
        }
    }
}