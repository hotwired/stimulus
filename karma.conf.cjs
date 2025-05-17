const config = {
  basePath: ".",

  browsers: ["ChromeHeadless", "FirefoxHeadless"],

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
      extensions: [".js"],
    },
  },

  client: {
    clearContext: false,
    qunit: {
      showUI: true,
    },
  },

  hostname: "0.0.0.0",

  captureTimeout: 180000,
  browserDisconnectTimeout: 180000,
  browserDisconnectTolerance: 3,
  browserNoActivityTimeout: 300000,
}

module.exports = function (karmaConfig) {
  karmaConfig.set(config)
}
