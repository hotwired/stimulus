import resolve from "@rollup/plugin-node-resolve"
import { version } from "./package.json"

const year = new Date().getFullYear()
const banner = `/*\nStimulus ${version}\nCopyright © ${year} Basecamp, LLC\n */`

export default [
  {
    external: [
      "@hotwired/stimulus",
      "@hotwired/stimulus-webpack-helpers"
    ],
    input: "index.js",
    output: [
      {
        globals: {
          '@hotwired/stimulus': 'Stimulus'
        },
        name: "Stimulus",
        file: "dist/stimulus.umd.js",
        format: "umd",
        banner
      },
      {
        file: "dist/stimulus.js",
        format: "es",
        banner
      },
    ],
    context: "window",
    plugins: [
      resolve()
    ]
  },
  {
    external: [
      "@hotwired/stimulus",
      "@hotwired/stimulus-webpack-helpers"
    ],
    input: "webpack-helpers.js",
    output: [
      {
        globals: {
          '@hotwired/stimulus-webpack-helpers': 'StimulusWebpackHelpers'
        },
        name: "Stimulus",
        file: "dist/webpack-helpers.umd.js",
        format: "umd",
        banner
      },
      {
        file: "dist/webpack-helpers.js",
        format: "es",
        banner
      },
    ],
    context: "window",
    plugins: [
      resolve()
    ]
  }
]
