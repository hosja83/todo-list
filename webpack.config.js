const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const { dirname } = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Todo List',
      template: './src/index.html',
      filename: 'index.html', //relative to ./dist or root of application
      hash: true,
      //myFirstPageHeader: 'You Can store any variable and call in html file',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
       test: /\.(woff|woff2|eot|ttf|otf)$/i, 
       type: 'asset/resource',
      },
    ],
  },
  devtool: 'source-map',
  devServer: {
    static: './dist',
  },
  optimization: {
    runtimeChunk: 'single',
  },
};