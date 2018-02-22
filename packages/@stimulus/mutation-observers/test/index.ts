const context = require.context("./cases", true, /\.ts$/)
const modules = context.keys().map(key => context(key).default)
modules.forEach(constructor => constructor.defineModule())
