const config = {
  basePath: ".",

  browsers: ["ChromeHeadless"],

  frameworks: ["qunit"],

  reporters: ["progress"],

  singleRun: true,

  autoWatch: false,

  files: [
    "**/dist/tests/index.js",
    { pattern: "**/tests/fixtures/**/*", included: false },
  ],

  preprocessors: {
    "**/dist/tests/**/*.js": ["webpack"]
  },

  webpack: {
    mode: "development",
    resolve: {
      extensions: [".js"]
    }
  },

  client: {
    clearContext: false,
    qunit: {
      showUI: true
    }
  },

  hostname: "0.0.0.0",

  captureTimeout: 180000,
  browserDisconnectTimeout: 180000,
  browserDisconnectTolerance: 3,
  browserNoActivityTimeout: 300000
}

if (process.env.CI) {
  config.customLaunchers = {
    sl_chrome_latest: {
      base: "SauceLabs",
      browserName: "chrome",
      version: "latest"
    },
    sl_chrome_latest_i8n: {
      base: "SauceLabs",
      browserName: "chrome",
      version: "latest",
      chromeOptions: {
        args: ["--lang=tr"]
      }
    },
    sl_firefox_43: {
      base: "SauceLabs",
      browserName: "firefox",
      version: "43"
    },
    sl_firefox_latest: {
      base: "SauceLabs",
      browserName: "firefox",
      version: "latest"
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
    sl_safari_latest: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "macOS 10.13",
      version: "latest"
    },
    sl_edge_17: {
      base: "SauceLabs",
      browserName: "microsoftedge",
      platform: "Windows 10",
      version: "17.17134"
    },
    sl_edge_latest: {
      base: "SauceLabs",
      browserName: "microsoftedge",
      platform: "Windows 10",
      version: "18.17763"
    },
    sl_ie_11: {
      base: "SauceLabs",
      browserName: "internet explorer",
      platform: "Windows 8.1",
      version: "11"
    },
    sl_ios_latest: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "ios",
      device: "iPhone X Simulator",
      version: "13.0"
    },
    sl_android_latest: {
      base: "SauceLabs",
      browserName: "chrome",
      platform: "android",
      device: "Android GoogleAPI Emulator",
      version: "10.0"
    }
  }
  config.browsers = Object.keys(config.customLaunchers)
  config.sauceLabs = { testName: "Stimulus Browser Tests" }
  config.reporters = ["dots", "saucelabs"]
}

module.exports = function (karmaConfig) {
  karmaConfig.set(config)
}
