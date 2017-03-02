const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    stimulus: './src/stimulus/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          { loader: 'ts-loader' }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
