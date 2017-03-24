const webpackConfig = require("./webpack.config")()

module.exports = function(config) {
  config.set({
    browsers: ["Chrome", "Firefox", "Safari"],

    frameworks: ["qunit"],

    reporters: ["progress"],

    files: [
      { pattern: "test/**/*_test.ts" }
    ],

    preprocessors: {
      "test/**/*.ts": ["webpack"]
    },

    mime: {
      "text/x-typescript": ["ts"]
    },

    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    }
  })
}
