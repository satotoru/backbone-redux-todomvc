const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'app.bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ],
    preLoaders: [
      { test: /\.js$/, loader: 'source-map-loader' }
    ],
  },
  plugins: [
    new LiveReloadPlugin(),
  ]
};
