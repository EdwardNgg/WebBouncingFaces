import * as dotenv from 'dotenv';
import path from 'path';
import url from 'url';

import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { createRequire } from 'module';

dotenv.config();
const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const allowedHosts = process.env.ALLOWED_HOSTS || 'auto';
const isDevelopment = process.env.NODE_ENV !== 'production';
const mode = isDevelopment ? 'development' : 'production';
const port = process.env.CLIENT_PORT || 3000;
const require = createRequire(import.meta.url);

export default {
  entry: './src/index.jsx',
  mode,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/env',
          ],
          plugins: [
            isDevelopment && require.resolve('react-refresh/babel'),
          ].filter(Boolean),
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.wgsl$/i,
        use: 'raw-loader',
      },
    ],
  },
  output: {
    path: path.resolve(dirname, 'public', 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: [
      '.*',
      '.js',
      '.jsx',
    ],
  },
  devServer: {
    allowedHosts,
    hot: true,
    port,
    static: path.resolve(dirname, 'public'),
    server: 'https',
  },
  plugins: [
    isDevelopment && new ReactRefreshPlugin(),
  ].filter(Boolean),
};
