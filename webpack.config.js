const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: "development",
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true,
    },
    devServer: {
        static: path.resolve(__dirname, 'public'),
        compress: true,
        port: 9009,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            baseUrl: '/'
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/static/fonts", to: "fonts"},
                {from: "./src/static/images", to: "images"},
                {from: "./src/templates", to: "templates"},
                {from: "./src/styles/sidebars.css", to: "css"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "js"},
                {
                    from: "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff",
                    to: "css/fonts"
                },
                {
                    from: "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2",
                    to: "css/fonts"
                },
                {from: "./node_modules/bootstrap-icons/font/bootstrap-icons.min.css", to: "css"},
                {from: "./node_modules/chart.js/dist/chart.js", to: "js"},
                {from: "./node_modules/chart.js/dist/chart.umd.js", to: "js"},
                {from: "./src/components/main-page.js", to: "js"},
                {from: "./src/components/balance.js", to: "js"},
            ],
        }),
    ],
};