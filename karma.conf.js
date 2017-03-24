const webpackConfig = require("./webpack.config")()

const config = {
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
}

if (process.env.CI) {
  config.customLaunchers = {
    sl_chrome: {
      base: "SauceLabs",
      browserName: "chrome",
      platform: "macOS 10.12",
      version: "56"
    }
  }
  config.browsers = Object.keys(config.customLaunchers)
  config.sauceLabs = { testName: "Stimulus Browser Tests" }
  config.reporters = ["dots", "saucelabs"]
  config.singleRun = true
}

module.exports = function(karmaConfig) {
  karmaConfig.set(config)
}
