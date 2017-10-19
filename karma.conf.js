const webpackConfig = require("./webpack.config")

const config = {
  // Run `defaults write com.apple.Safari ApplePersistenceIgnoreState YES`
  // to work around Safari tab issue: https://github.com/karma-runner/karma-safari-launcher/issues/6
  browsers: getBrowsersFromEnvironment() || ["ChromeHeadless"],

  frameworks: ["qunit"],

  reporters: ["progress"],

  files: [
    { pattern: "test/*_test.ts" }
  ],

  preprocessors: {
    "test/*.ts": ["webpack"]
  },

  mime: {
    "text/x-typescript": ["ts"]
  },

  webpack: {
    module: webpackConfig.module,
    resolve: webpackConfig.resolve
  },

  client: {
    clearContext: false,
    qunit: {
      showUI: true
    }
  },

  browserDisconnectTolerance: 2,
  browserDisconnectTimeout: 10000,
  browserNoActivityTimeout: 20000
}

if (process.env.CI) {
  config.customLaunchers = {
    sl_chrome: {
      base: "SauceLabs",
      browserName: "chrome",
      version: "61"
    },
    sl_firefox: {
      base: "SauceLabs",
      browserName: "firefox",
      version: "56"
    },
    sl_safari: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "macOS 10.12",
      version: "10.0"
    },
    sl_edge: {
      base: "SauceLabs",
      browserName: "microsoftedge",
      platform: "Windows 10",
      version: "15.15063"
    },
    sl_ie: {
      base: "SauceLabs",
      browserName: "internet explorer",
      platform: "Windows 8.1",
      version: "11"
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

function getBrowsersFromEnvironment() {
  const env = process.env.BROWSERS
  if (env == "all") {
    return ["Chrome", "Firefox", "Safari"]
  } else if (env) {
    return env.split(",")
  }
}
