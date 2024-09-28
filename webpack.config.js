const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
// const Dotenv = require('dotenv-webpack');
const path = require('path');



module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'modules.bundle.js',
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    }
                ]
            },
            { test: /\.(js|jsx)$/, use: 'babel-loader' },
            { test: /\.(ts|tsx)$/, use: 'ts-loader' },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Resolves these extensions
        alias: {},
    },
    devServer: {
        port: 3002
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html' }),
        new ModuleFederationPlugin({
            name: 'aichat',
            filename: "remoteEntry.js",
            remotes: {
                // import cherrytopframework
                app: 'app@http://localhost:8080/mf-manifest.json',
                // mf2: 'mf2@http://localhost:8082/remoteEntry.js',
                mf2: 'mf2@https://cherrytopframeworktester.netlify.app/remoteEntry.js',
            },
            exposes: {
                // export app
                "./App": "./src/Entry.tsx",
            },
            shared: {
                react: {singleton: true},
                "react-dom": {singleton: true},
                // For advanced/complex state management
                zustand: { singleton: true }, // Share Zustand to ensure single store instance
            }
        }),
        // new Dotenv({})
    ]
};
