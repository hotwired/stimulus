import resolve from "@rollup/plugin-node-resolve"

export default [
  {
    input: "index.js",
    output: [
      {
        name: "Stimulus",
        file: "dist/stimulus.umd.js",
        format: "umd"
      },
      {
        file: "dist/stimulus.js",
        format: "es"
      },
    ],
    context: "window",
    plugins: [
      resolve()
    ]
  },
  {
    input: "webpack-helpers.js",
    output: [
      {
        name: "StimulusWebpackHelpers",
        file: "dist/webpack-helpers.umd.js",
        format: "umd"
      },
      {
        file: "dist/webpack-helpers.js",
        format: "es"
      },
    ],
    context: "window",
    plugins: [
      resolve()
    ]
  }
]
