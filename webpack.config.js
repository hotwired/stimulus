const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const dts = require("dts-bundle")

const config = {}

config.all = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                outDir: "../build"
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: [
          /node_modules/
        ],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["es2015", { modules: false }]
              ],
              plugins: [
                "transform-decorators-legacy"
              ]
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

config.development = {
  entry: {
    main: "./examples/index.js"
  },

  output: {
    filename: "[name].js"
  },

  devtool: "inline-source-map"
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
    new webpack.optimize.UglifyJsPlugin(),
    new class {
      apply(compiler) {
        compiler.plugin("done", () => {
          dts.bundle({
            name: "stimulus",
            baseDir: __dirname,
            main: "./build/index.d.ts",
            out: "./dist/stimulus.d.ts",
            outputAsModuleFolder: true
          })
        })
      }
    },
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

module.exports = function(env = {}) {
  const configEnv = Object.keys(env)[0] || "development"
  return merge(config.all, config[configEnv])
}
