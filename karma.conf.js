const webpackConfig = require("./webpack.config")()

module.exports = function(config) {
  config.set({
    frameworks: ["qunit"],
    files: [
      { pattern: "test/**/*.ts" }
    ],
    preprocessors: {
      "test/**/*.ts": ["webpack"]
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    mime: {
      "text/x-typescript": ["ts"]
    },
    reporters: ["progress"],
    browsers: ["Chrome"]
  })
}
