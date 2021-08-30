import resolve from "@rollup/plugin-node-resolve"
import { version } from "./package.json"

const year = new Date().getFullYear()
const banner = `/*\nStimulus ${version}\nCopyright © ${year} Basecamp, LLC\n */`

export default {
  input: "index.js",
  output: [
    {
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
}
