const path = require("path")

module.exports = {
  entry: {
    main: "./index.js"
  },

  output: {
    filename: "[name].js"
  },

  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          { loader: "ts-loader" }
        ]
      },
      {
        test: /\.js$/,
        exclude: [
          /node_modules/
        ],
        use: [
          { loader: "babel-loader" }
        ]
      }
    ]
  },

  resolve: {
    extensions: [".ts", ".js"],
    modules: ["src", "node_modules"],
    alias: {
      "stimulus": path.resolve(__dirname, "../src/index.ts")
    }
  }
}
