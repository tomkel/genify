const webpack = require('webpack')

let plugins = []
if (process.env.NODE_ENV === 'production') {
  plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ]
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
