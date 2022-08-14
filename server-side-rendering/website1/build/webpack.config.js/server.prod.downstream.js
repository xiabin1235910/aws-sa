const { NodeModuleFederation, NodeAsyncHttpRuntime } = require('@telenko/node-mf')
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
    publicPath: "http://localhost:3001/server_downstream/",
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
      name: "website1",
      library: { type: "var", name: "website1" },
      filename: "container.js",
      exposes: {
        "./App": "./src/components/FederationApp",
      },
      remotes: {
        // no meaningful config here, but it's the mock for upstream calling
        storybook: "storybook",
        website2: "website2",
      },
      shared: ["react", "react-dom"]
    }),
    new NodeAsyncHttpRuntime(),
  ],
  stats: {
    colors: true,
  },
};