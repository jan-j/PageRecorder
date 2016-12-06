const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GenerateJsonWebpackPlugin = require('generate-json-webpack-plugin');

const srcDir = path.join(__dirname, 'src');
const createManifest = require(path.join(srcDir, 'createManifest'));

const createWebpackConfig = function (env) {
    const distDir = path.join(__dirname, 'dist', env);

    const config = {
        entry: {
            popup: path.join(srcDir, 'popup.ts'),
            background: path.join(srcDir, 'background.ts')
        },
        output: {
            path: distDir,
            filename: '[name].js',
            publicPath: 'https://localhost:3001/'
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
        },
        module: {
            loaders: [
                // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                { test: /\.tsx?$/, loader: 'ts-loader' }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env)
            }),
            new HtmlWebpackPlugin({
                template: path.join(srcDir, 'background.html'),
                filename: 'background.html',
                chunks: ['background'],
                inject: false
            }),
            new HtmlWebpackPlugin({
                template: path.join(srcDir, 'popup.html'),
                filename: 'popup.html',
                chunks: ['popup'],
                inject: false
            }),
            new CopyWebpackPlugin([
                {
                    context: path.join(srcDir, 'assets'),
                    from: '**/*',
                    to: path.join(distDir, 'assets')
                }
            ]),
            new GenerateJsonWebpackPlugin('manifest.json', createManifest(env), null, 2),
        ]
    };

    if (env === 'production') {
        config.plugins.push(
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.AggressiveMergingPlugin()
        )
    } else {
        config.devServer = {
            host: 'localhost',
            port: 3001,
            https: true,
            outputPath: distDir,
        };

        config.plugins.push(
            new WriteFileWebpackPlugin()
        );
    }

    return config;
};

module.exports = createWebpackConfig;