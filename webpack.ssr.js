const path = require("path")
const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const htmlWebpackPlugin = require("html-webpack-plugin")
const minicss = require("mini-css-extract-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const TxtWebpackPlugin = require("./myPlugins/txt-webpack-plugin.js")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
module.exports = {
  mode: "production",
  devtool: "source-map", //生成map文件
  //多文件入口
  entry: {
    server: "./src/server/index.js",
    "server.min": "./src/server/index.js",
  },
  //指定loader查找文件夹
  // resolveLoader: {
  //   modules: ["node_modules", "myloader"],
  // },
  //输出
  output: {
    path: path.resolve(__dirname, "./dist"),
    // filename: "[name][chunkhash:8].js",
    filename: "[name].js",
    libraryTarget: "umd",
    libraryExport: "default",
  },
  module: {
    rules: [
      // 自定义loader
      // {
      //   test: /\.js$/,
      //   use: [
      //     {
      //       loader: "replace-loader",
      //       options: {
      //         llgtfoo: "llgtfoo@163.com",
      //       },
      //     },
      //   ],
      // },
      // {
      //   test: /\.js$/,
      //   use: [
      //     {
      //       loader: path.join(__dirname, "./myloader/replace-loader.js"),
      //       options: {
      //         llgtfoo: "llgtfoo@163.com",
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.js$/,
        use: {
          //js高级语法babel处理
          loader: "babel-loader",
        },
      },
      {
        test: /\.(eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            publicPath: "../",
          },
        },
      },
      //image loader拷贝image文件到输出目录
      {
        test: /\.(png|jpe?g|gif|jpg)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash:8].[ext]",
            outputPath: "images/",
            //⼩于2048，才转换成base64
            limit: 2048,
            publicPath: "../images",
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          minicss.loader,
          // "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "px2rem-loader", //px转rem
            //lib-flexible js库设置html font-size 基值
            options: {
              remUnit: 16, //1rem=16px
              remPrecesion: 8, //保留小数
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          minicss.loader,
          // "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader",
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 16, //1rem=16px
              remPrecesion: 8, //保留小数
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          minicss.loader,
          // "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 16, //1rem=16px
              remPrecision: 8, //保留小数
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    //清除dist
    new CleanWebpackPlugin(),
    //拷贝文件
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: "./public/*ico",
    //       to: path.join(__dirname, "./dist/favicon.ico"),
    //     },
    //   ],
    // }),
    // //自定义plugin
    // new TxtWebpackPlugin({
    //   name: "llgtfoo",
    // }),
    // //生成文件
    new htmlWebpackPlugin({
      title: "webpack list",
      template: "./public/list.html",
      filename: "list.html",
      chunks: ["list"], //引用
      inject: true,
    }),
    // css独立文件style-loader换成minicss.loader
    new minicss({
      chunkFilename: "[id].css",
      filename: "css/[name].css",
    }),
    //css压缩
    // new OptimizeCssAssetsPlugin({
    //   assetNameRegExp: /\.css$/g,
    //   cssProcessor: require("cssnano"),
    // }),
  ],
  //server
  devServer: {
    contentBase: path.join(__dirname, "./dist"),
    open: true,
    port: 8080,
    hot: true,
    //即便HMR不⽣效，浏览器也不⾃动刷新，就开启hotOnly
    hotOnly: true,
  },
  // 提出react和react-dom脚本
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /(react|react-dom)/,
  //         name: "reactCommon",
  //         chunks: "all",
  //       },
  //     },
  //   },
  //   //将min.js文件压缩，production模式会压缩代码
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({
  //       include: /\.min\.js$/,
  //     }),
  //   ],
  // },
  //提出公共文件css或者js生成名为commons.*
  // optimization: {
  //   splitChunks: {
  //     minSize: 0,
  //     cacheGroups: {
  //       commons: {
  //         name: "commons",
  //         chunks: "all",
  //         minChunks: 2,
  //       },
  //     },
  //   },
  // },
  // proxy: {
  //   "/api": {
  //     target: "http://localhost:9092",
  //   },
  // },
}
