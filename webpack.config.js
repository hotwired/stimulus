const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    stimulus: './src/stimulus/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    library: 'Stimulus'
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
  },
  devServer: {
    contentBase: path.join(__dirname, 'examples'),
    port: 9000
  }
}
