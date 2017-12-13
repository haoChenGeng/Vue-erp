const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const projectRoot = path.resolve(__dirname, '../')
const staticPath = path.resolve(__dirname, '../static/js')

module.exports = {
  entry: {
    vendor: ['vue/dist/vue.common.js','vue-router','axios', 'vue-echarts-v3', 't8t-element-ui', 'lodash']
  },
  output: {
    path: path.join(__dirname, '../static/js'),
    filename: '[name].[chunkhash:8].dll.js',
    library: '[name]_library'       // vendor.dll.js中暴露出的全局变量名
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.json'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '[name]-manifest.json'),
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(projectRoot, 'index.html'),
      template: path.resolve(staticPath, 'template.html'),
      inject: true
    }),
    new CleanWebpackPlugin(
      [path.resolve(staticPath, 'vendor*.js')],
      {
        root: projectRoot,
        verbose: true,
        dry: false
      }
    )
  ]
};
