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
      extensions: ['.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [{
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { development: argv.mode === 'development' }],
            ],
          },
        },
      },
    ],
    }
  }
}