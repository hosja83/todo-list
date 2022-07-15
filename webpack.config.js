const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const { dirname } = require('path');

module.exports = {
  mode: 'development',
  // mode: 'production',
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
      template: './src/view/index.html',
      filename: 'index.html', //relative to ./dist or root of application
      hash: true,
      //myFirstPageHeader: 'You Can store any variable and call in html file',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, './src/styles'),
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        include: path.resolve(__dirname, './src/styles'),
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: path.resolve(__dirname, './src/assets'),
        type: 'asset/resource',
      },
      {
       test: /\.(woff|woff2|eot|ttf|otf)$/i,
       include: path.resolve(__dirname, './src/assets'),
       type: 'asset/resource',
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ],
  },
  devtool: 'inline-source-map',
  // devtool: 'source-map',
  /* For development only */
  devServer: {
    static: './dist',
  },
  optimization: {
    runtimeChunk: 'single',
  },
  /* Increasing performance during production build mode */
  // performance: {
  //   hints: false,
  //   maxEntrypointSize: 512000,
  //   maxAssetSize: 512000
  // },
};