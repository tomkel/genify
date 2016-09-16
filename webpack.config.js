const webpack = require('webpack')

const plugins = []
if (process.env.NODE_ENV) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    })
  )
}

module.exports = {
  entry: ['babel-polyfill', 'isomorphic-fetch', './app/entry'],
  output: {
    path: './dist',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['latest', 'react'],
        plugins: ['transform-class-properties'],
      },
    }],
  },
  plugins,
}
