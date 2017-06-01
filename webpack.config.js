const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const dts = require("dts-bundle")

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
                outDir: "../build"
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
    new class {
      apply(compiler) {
        compiler.plugin("done", () => {
          dts.bundle({
            name: "sentinella",
            baseDir: root,
            main: root + "/build/index.d.ts",
            out: root + "/dist/sentinella.d.ts",
            outputAsModuleFolder: true
          })
        })
      }
    }
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
