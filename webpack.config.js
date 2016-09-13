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
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loader: 'style!css?modules',
    }],
  },
}
