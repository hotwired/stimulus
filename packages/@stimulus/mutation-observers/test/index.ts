const context = require.context("./cases", true, /\.ts$/)
context.keys().forEach(context)
