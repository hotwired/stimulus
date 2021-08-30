const context = require.context("./modules", true, /\.js$/)
const modules = context.keys().map(key => context(key).default)
modules.forEach(constructor => constructor.defineModule())
