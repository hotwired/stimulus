const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const config = {}

config.all = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          { loader: "ts-loader" }
        ]
      }
    ]
  },

  resolve: {
    extensions: [".ts", ".js"],
    modules: ["src", "node_modules"]
  }
}

config.development = {
  entry: {
    examples: "./examples/index.js"
  },

  output: {
    filename: "[chunkhash]-[name].js"
  },

  devtool: "inline-source-map",

  devServer: {
    contentBase: "./examples",
    port: 9000
  },

  plugins: [
    new HtmlWebpackPlugin({template: "examples/index.html"})
  ]
}

config.production = {
  entry: {
    stimulus: "./src/stimulus/index.ts"
  },

  output: {
    filename: "[name].js",
    path: "./dist",
    library: "Stimulus",
    libraryTarget: "umd"
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}

module.exports = function(env = {}) {
  const configEnv = Object.keys(env)[0]

  if (configEnv) {
    return merge(config.all, config[configEnv])
  } else {
    return config.all
  }
}
