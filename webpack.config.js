import webpack from 'webpack' //to access built-in plugins
import path from 'node:path'

export default (env, argv) => {
  console.log('argv.mode is ', argv.mode)

  return {
    entry: './app/entry',
    output: {
      path: path.resolve('./dist/'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }]
    },
  }
}