const path = require("node:path");
const fs = require("node:fs");
const webpack = require("webpack");

const root = path.resolve(__dirname, "..");

webpack({
    mode: "production",
    entry: path.join(root, "dist/markdown/index.js"),
    target: ["web", "es2020"],
    output: {
        path: path.join(root, "dist/markdown"),
        filename: "zrlog-markdown.umd.js",
        library: {name: "ZrLogMarkdown", type: "umd"},
        globalObject: "globalThis",
    },
    devtool: false,
    performance: {hints: false},
}, (error, stats) => {
    if (error || stats.hasErrors()) {
        console.error(error || stats.toString({all: false, errors: true}));
        process.exitCode = 1;
        return;
    }
    fs.copyFileSync(path.join(root, "dist/markdown/index.d.ts"), path.join(root, "dist/markdown/zrlog-markdown.umd.d.ts"));
    console.log(stats.toString({all: false, assets: true, warnings: true}));
});
