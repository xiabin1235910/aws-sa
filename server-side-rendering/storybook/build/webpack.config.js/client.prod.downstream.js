const { loaders } = require('./loaders')

const webpack = require('webpack')
const path = require('path')

const LoadablePlugin = require("@loadable/webpack-plugin");
const FederationModuleIdPlugin = require('webpack-federation-module-id-plugin')
const FederationStatsPlugin = require('webpack-federation-stats-plugin')


const deps = '^16.8.6'

const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;

module.exports = {
  name: "client",
  target: "web",
  entry: ["@babel/polyfill", path.resolve(__dirname, "../../src/index.js")],
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "../../buildClientDown/static"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    publicPath: `http://localhost:${process.env.PORT}/static_downstream/`,
    clean: true
  },
  resolve: {
    extensions: [".js", ".mjs", ".jsx", ".css", ".json", ".cjs"],
  },
  module: {
    rules: loaders.client,
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new LoadablePlugin({ filename: "stats.json", writeToDisk: true }),
    new FederationStatsPlugin(),
    new FederationModuleIdPlugin(),
    new ModuleFederationPlugin({
      name: "storybook",
      filename: "container.js",
      exposes: {
        "./Button": "./src/components/meta/Button.js",
        "./Modal": "./src/components/meta/Modal.js"
      },
      shared: ["react", "react-dom"],
    }),
  ],
}
