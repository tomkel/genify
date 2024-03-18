const webpack = require('webpack'); //to access built-in plugins
const path = require('path')

module.exports = (env, argv) => {
  console.log('argv.mode is ', argv.mode)

  return {
    entry: './app/entry',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { development: argv.mode === 'development' }],
            ],
          },
        },
      }],
    }
  }
}