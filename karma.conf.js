const config = {
  browsers: ["ChromeHeadless"],

  frameworks: ["qunit"],

  reporters: ["progress"],

  files: [
    { pattern: "packages/*/**/test/**/*_test.ts" }
  ],

  preprocessors: {
    "packages/**/*.ts": ["webpack"]
  },

  mime: {
    "text/x-typescript": ["ts"]
  },

  webpack: {
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
      extensions: [".ts", ".js"]
    }
  },

  client: {
    clearContext: false,
    qunit: {
      showUI: true
    }
  },

  captureTimeout: 180000,
  browserDisconnectTimeout: 180000,
  browserDisconnectTolerance: 3,
  browserNoActivityTimeout: 300000
}

if (process.env.CI) {
  config.customLaunchers = {
    sl_chrome: {
      base: "SauceLabs",
      browserName: "chrome",
      version: "63"
    },
    sl_firefox: {
      base: "SauceLabs",
      browserName: "firefox",
      version: "57"
    },
    sl_safari_9: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "OS X 10.11",
      version: "9"
    },
    sl_safari_10_1: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "macOS 10.12",
      version: "10.1"
    },
    sl_safari_11: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "macOS 10.13",
      version: "11"
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
