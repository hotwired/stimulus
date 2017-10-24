const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: {
    stimulus: "./dist/module/index.js"
  },

  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
    library: "Stimulus",
    libraryTarget: "umd"
  },

  externals: {
    sentinella: {
      commonjs: "sentinella",
      commonjs2: "sentinella",
      amd: "sentinella",
      root: "Sentinella"
    }
  },

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
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin({
      banner: (() => {
        const {version} = require('./package.json')
        const year = new Date().getFullYear()
        return `/*\nStimulus ${version}\nCopyright © ${year} Basecamp, LLC\n */`
      })(),
      raw: true
    })
  ]
}
