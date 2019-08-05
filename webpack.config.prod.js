const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/main.js',
  },

  mode: 'production',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },

      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  autoprefixer({
                    browsers: ['> 1%', 'last 2 versions'],
                  }),
                ];
              },
            },
          },
          'sass-loader',
          'import-glob-loader',
        ],
      },

      {
        test: /\.(png|jpe?g|gif|webm|mp4|ogv|txt|mp3|ogg|wav|pdf)$/,
        loader: 'file-loader',
        options: {
          context: path.resolve(__dirname, './src'),
          name: '[path][name].[ext]',
        },
      },

      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'img:srcset', 'source:src', 'source:srcset'],
              removeComments: false,
            },
          },

          {
            loader: path.resolve('pug-html-loader'),
            options: {
              exports: false,
              data: {
                fs,
                process: {
                  env: {
                    NODE_ENV: 'production',
                  },
                },
              },
            },
          },
        ],
      },

      {
        test: /\.(eot|otf|woff|woff2|ttf|svg)$/,
        use: ['url-loader?name=fonts/[name].[ext]'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      favicon: './favicon.png',
      title: 'Rumo ao 10',
      template: path.join('./src', 'index.pug'),
    }),

    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
    publicPath: './',
  },
};
