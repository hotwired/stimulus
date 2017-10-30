const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: {
    stimulus: "./index.js"
  },

  output: {
    filename: "[name].umd.js",
    path: path.resolve("./dist"),
    library: "Stimulus",
    libraryTarget: "umd"
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin({
      banner: (() => {
        const { version } = require('../../lerna.json')
        const year = new Date().getFullYear()
        return `/*\nStimulus ${version}\nCopyright © ${year} Basecamp, LLC\n */`
      })(),
      raw: true
    })
  ]
}
