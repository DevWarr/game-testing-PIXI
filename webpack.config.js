/* eslint-disable no-undef */

const path = require("path");

module.exports = env => {
    if (!env || !env.moduleName) {
        console.error("No module name given!\nPlease specify a module name with the --env.moduleName tag\n");
        process.exit(1);
    }

    return {
        entry: "./src/" + env.moduleName + "/src/index.ts",
        output: {
            filename: "main.js",
            path: path.resolve(__dirname, "dist"),
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        optimization: {
            minimize: false,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
    };
};