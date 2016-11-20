module.exports = {
    entry: {
        popup: './src/popup.ts',
        background: './src/background.ts'
    },
    output: {
        filename: './build/[name].js',
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
    devServer: {
        host: 'localhost',
        port: 3001,
        https: true,
    }
};