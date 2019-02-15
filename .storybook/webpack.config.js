const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = (baseConfig, env, config) => {
    config.module.rules.push({
        test: /\.tsx?$/,
        include: [
            path.resolve(__dirname, "../src"),
            path.resolve(__dirname, "../test"),
            path.resolve(__dirname, "../examples")
        ],
        use: [
            {
                loader: require.resolve('babel-loader'),
                options: {
                    presets: [require.resolve('babel-preset-react-app')]
                }
            },
            require.resolve("react-docgen-typescript-loader")
        ],
        resolve: {
            alias: {
                "mui-tables": "../dist"
            }
        }
    });
    //defaultConfig.plugins.push(new TSDocgenPlugin());
    config.resolve.extensions.push(".ts", ".tsx", ".js");
    return config;
};
