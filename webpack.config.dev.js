const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');

const src = path.join(__dirname, 'src');

// Webpack local development config
module.exports = {
  entry: {
    index: path.join(src, 'index.pug'),
    app: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './src/main.js',
    ],
  },

  mode: 'development',

  devtool: 'cheap-eval-source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['happypack/loader?id=js'],
      },

      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['happypack/loader?id=sass'],
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
        exclude: /node_modules/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'img:srcset', 'source:src', 'source:srcset'],
            },
          },
          {
            loader: path.resolve('pug-html-loader'),
            options: {
              cache: true,
              data: {
                fs,
                process: {
                  env: {
                    NODE_ENV: 'development',
                  },
                },
              },
            },
          },
        ],
      },
    ],
  },

  // Local server config
  devServer: {
    port: 3000,
    hot: true,
  },

  plugins: [
    new HappyPack({ // Convert SCSS to CSS
      id: 'sass',
      loaders: [
        'style-loader',
        {
          loader: 'css-loader',
        },
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
        {
          loader: 'sass-loader',
        },
        {
          loader: 'import-glob-loader',
        },
      ],
    }),

    new HappyPack({ //Convert newest ECMAScript to old versions
      id: 'js',
      loaders: [
        {
          loader: 'babel-loader',
          exclude: /node_modules/,
          include: path.resolve(process.cwd(), 'src'),
        },
      ],
    }),

    new HtmlWebpackPlugin({ // Base HTML config
      fs,
      favicon: './favicon.png',
      title: 'Rumo ao 10',
      template: './src/index.pug',
    }),

    new webpack.HotModuleReplacementPlugin(), // Auto update page when developing
  ],

  output: { // JS output config
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },
};
