import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"

import { version } from "./package.json"
const year = new Date().getFullYear()
const banner = `/*\nStimulus ${version}\nCopyright © ${year} Basecamp, LLC\n */`

export default {
  input: "src/index.js",
  output: {
    file: "dist/stimulus.js",
    format: "es",
    banner
  },
  context: "window",
  plugins: [
    resolve(),
    typescript()
  ]
}
