module.exports = {
  entry: './app/entry.jsx',
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
}
