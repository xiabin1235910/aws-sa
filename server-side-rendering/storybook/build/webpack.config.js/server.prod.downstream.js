const { NodeAsyncHttpRuntime } = require('@telenko/node-mf')
const webpack = require('webpack')
const path = require('path')

const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;

module.exports = {
  name: "server",
  mode: "production",
  target: false,
  entry: ["@babel/polyfill", path.resolve(__dirname, "../../server/index.js")],
  output: {
    path: path.resolve(__dirname, "../../buildServerDown"),
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    libraryTarget: "commonjs2",
    publicPath: "http://localhost:3003/server_downstream/",
    clean: true
  },
  resolve: {
    extensions: [".js", ".mjs", ".jsx", ".css", ".json", ".cjs"],
  },
  externals: ["enhanced-resolve"],
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ModuleFederationPlugin({
      name: "storybook",
      library: { type: "var", name: "storybook" },
      filename: "container.js",
      exposes: {
        "./Button": "./src/components/meta/Button.js",
        "./Modal": "./src/components/meta/Modal.js"
      },
      shared: ['react', 'react-dom']
    }),
    new NodeAsyncHttpRuntime(),
  ],
  stats: {
    colors: true,
  },
};