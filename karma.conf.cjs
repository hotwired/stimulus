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
    sl_firefox_65: {
      base: "SauceLabs",
      browserName: "firefox",
      version: "65.0"
    },
    sl_firefox_latest: {
      base: "SauceLabs",
      browserName: "firefox",
      version: "latest"
    },
    sl_safari_12_1: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "macOS 10.13",
      version: "12.1"
    },
    sl_safari_latest_catalina: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "macOS 10.15",
      version: "latest"
    },
    sl_safari_latest_big_sur: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "macOS 11",
      version: "latest"
    },
    sl_edge_79: {
      base: "SauceLabs",
      browserName: "microsoftedge",
      platform: "Windows 10",
      version: "79.0"
    },
    sl_edge_latest: {
      base: "SauceLabs",
      browserName: "microsoftedge",
      platform: "Windows 10",
      version: "latest"
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
