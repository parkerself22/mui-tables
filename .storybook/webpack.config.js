const path = require("path");

module.exports = (baseConfig, env, config) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
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
            {
                loader: require.resolve("react-docgen-typescript-loader")
            }
        ],
        resolve: {
            alias: {
                "mui-tables": "../dist"
            }
        }
    });
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
};
