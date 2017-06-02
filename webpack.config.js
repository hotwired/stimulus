const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")

const root = __dirname
const config = {}

config.all = {
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                outDir: "../dist"
              }
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: [".ts", ".js"],
    modules: ["src", "node_modules"]
  }
}

config.production = {
  entry: {
    "sentinella": root + "/src/index.ts"
  },

  output: {
    filename: "[name].js",
    path: root + "/dist",
    library: "Sentinella",
    libraryTarget: "umd"
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin({
      banner: (() => {
        const {version} = require('./package.json')
        const year = new Date().getFullYear()
        return `/*\nSentinella ${version}\nCopyright © ${year} Basecamp, LLC\n */`
      })(),
      raw: true
    })
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
