const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '.'),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "lib/bootstrap"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "lib/bootstrap"},
            ],
        }),
    ],
};