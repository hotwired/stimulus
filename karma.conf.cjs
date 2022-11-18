const config = {
  basePath: ".",

  browsers: ["ChromeHeadless"],

  frameworks: ["qunit"],

  reporters: ["progress"],

  singleRun: true,

  autoWatch: false,

  files: [
    "dist/tests/index.js",
    { pattern: "src/tests/fixtures/**/*", watched: true, served: true, included: false },
    { pattern: "dist/tests/fixtures/**/*", watched: true, served: true, included: false },
  ],

  preprocessors: {
    "dist/tests/**/*.js": ["webpack"],
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
      browserVersion: "latest"
    },
    sl_chrome_latest_i8n: {
      base: "SauceLabs",
      browserName: "chrome",
      browserVersion: "latest",
      "goog:chromeOptions": {
        args: ["--lang=tr"]
      }
    },
    sl_firefox_65: {
      base: "SauceLabs",
      browserName: "firefox",
      browserVersion: "65.0"
    },

    // Context:
    // https://github.com/karma-runner/karma-sauce-launcher/issues/275
    // https://saucelabs.com/blog/update-firefox-tests-before-oct-4-2022
    sl_firefox_latest: {
      base: "SauceLabs",
      browserName: "firefox",
      browserVersion: "latest",
      "moz:debuggerAddress": true
    },
    sl_safari_12_1: {
      base: "SauceLabs",
      browserName: "safari",
      platformName: "macOS 10.13",
      browserVersion: "12.1"
    },
    sl_safari_latest_catalina: {
      base: "SauceLabs",
      browserName: "safari",
      platformName: "macOS 10.15",
      browserVersion: "latest"
    },
    sl_safari_latest_big_sur: {
      base: "SauceLabs",
      browserName: "safari",
      platformName: "macOS 11",
      browserVersion: "latest"
    },
    sl_edge_79: {
      base: "SauceLabs",
      browserName: "microsoftedge",
      platformName: "Windows 10",
      browserVersion: "79.0"
    },
    sl_edge_latest: {
      base: "SauceLabs",
      browserName: "microsoftedge",
      platformName: "Windows 10",
      browserVersion: "latest"
    },
    // TODO: migrate to W3C capabilities
    sl_ios_latest: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "ios",
      device: "iPhone X Simulator",
      version: "13.0"
    },
    // TODO: migrate to W3C capabilities
    sl_android_latest: {
      base: "SauceLabs",
      browserName: "chrome",
      platform: "android",
      device: "Android GoogleAPI Emulator",
      version: "10.0"
    }
  }
  config.browsers = Object.keys(config.customLaunchers)
  config.reporters = ["dots", "saucelabs"]
  config.sauceLabs = {
    testName: "Stimulus Browser Tests",
    [atob("dXNlcm5hbWU=")]: atob("c3RpbXVsdXM="),
    [atob("YWNjZXNzS2V5")]: atob("NDI2NzMxMzUtYTViYy00ODlhLThlYTktMDY4MmMzYjcyMjRh")
  }

  function atob(a) {
    return Buffer.from(a, "base64").toString()
  }
}

module.exports = function (karmaConfig) {
  karmaConfig.set(config)
}
