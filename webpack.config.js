const path = require("path")
const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const htmlWebpackPlugin = require("html-webpack-plugin")
const minicss = require("mini-css-extract-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const TxtWebpackPlugin = require("./myPlugins/txt-webpack-plugin.js")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin")
const projectRoot = process.cwd() //当前进程文件目录
const smp = new SpeedMeasureWebpackPlugin() //耗时分析
const webpackBundleAnalyzer = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin //体积分析
const hardSourceWebpackPlugin = require("hard-source-webpack-plugin")
module.exports = smp.wrap({
  mode: "none", //production
  devtool: "source-map", //生成map文件
  //多文件入口
  entry: {
    index: "./src/index/index.js",
    "index.min": "./src/index/index.js", //生成min.js文件
    // list: "./src/list/index.js",
    // detail: "./src/detail/index.js",
  },
  //指定loader查找文件夹
  resolveLoader: {
    modules: ["node_modules", "myloader"],
  },
  //输出
  output: {
    path: path.resolve(projectRoot, "./dist"),
    // filename: "[name][chunkhash:8].js",
    filename: "js/[name]_[hash:8].js",
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
      //       loader: path.join(projectRoot, "./myloader/replace-loader.js"),
      //       options: {
      //         llgtfoo: "llgtfoo@163.com",
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.js$/,
        use: [
          {
            //开启多线程loader
            loader: "thread-loader",
            options: {
              workers: 3,
            },
          },
          {
            //js高级语法babel处理
            loader: "babel-loader",
          },
        ],
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
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]_[hash:8].[ext]",
              outputPath: "images/",
              //⼩于2048，才转换成base64
              limit: 2048,
              publicPath: "../images",
            },
          },
          // {
          //   loader: "image-webpack-loader",
          //   options: {
          //     mozjpeg: {
          //       progressive: true,
          //     },
          //     // optipng.enabled: false will disable optipng
          //     optipng: {
          //       enabled: false,
          //     },
          //     pngquant: {
          //       quality: [0.65, 0.9],
          //       speed: 4,
          //     },
          //     gifsicle: {
          //       interlaced: false,
          //     },
          //     // the webp option will enable WEBP
          //     webp: {
          //       quality: 75,
          //     },
          //   },
          // },
        ],
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
    //引入分包
    new webpack.DllReferencePlugin({
      manifest: require("./build/library/library.json"),
    }),
    //文件体积分析8088端口
    // new webpackBundleAnalyzer(),
    //异常报错自定义捕获
    function errorPlugin() {
      this.hooks.done.tap("done", (stats) => {
        if (
          stats.compilation.errors &&
          stats.compilation.errors.length &&
          process.argv.indexOf("--watch") !== -1
        ) {
          console.log("build error")
          process.exit(1)
        }
      })
    },
    //日志提示优化
    new FriendlyErrorsWebpackPlugin(),
    //热更新
    new webpack.HotModuleReplacementPlugin(),
    //清除dist
    new CleanWebpackPlugin(),
    //拷贝文件
    new CopyPlugin({
      patterns: [
        {
          from: "./public/*ico",
          to: path.join(projectRoot, "./dist/favicon.ico"),
        },
      ],
    }),
    //自定义plugin
    new TxtWebpackPlugin({
      name: "llgtfoo",
    }),
    //生成文件
    new htmlWebpackPlugin({
      title: "webpack index",
      template: "./public/index.html",
      filename: "index.html",
      chunks: ["index", "reactCommon"],
      inject: true,
      minify: {
        //压缩html文件配置
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        preserveLineBreaks: true,
      },
    }),
    // new htmlWebpackPlugin({
    //   title: "webpack list",
    //   template: "./public/list.html",
    //   filename: "list.html",
    //   chunks: ["list", "reactCommon"], //引用
    //   inject: true,
    // }),
    // new htmlWebpackPlugin({
    //   title: "webpack detail",
    //   template: "./public/detail.html",
    //   filename: "detail.html",
    //   chunks: ["detail"],
    //   inject: true,
    // }),
    // css独立文件style-loader换成minicss.loader
    new minicss({
      chunkFilename: "[id].css",
      filename: "css/[name]_[contenthash:8].css",
    }),
    //css压缩
    // new OptimizeCssAssetsPlugin({
    //   assetNameRegExp: /\.css$/g,
    //   cssProcessor: require("cssnano"),
    // }),
    //缓存
    // new hardSourceWebpackPlugin(),
  ],
  //server
  devServer: {
    contentBase: path.join(projectRoot, "./dist"),
    open: true,
    port: 8080,
    hot: true,
    //即便HMR不⽣效，浏览器也不⾃动刷新，就开启hotOnly
    hotOnly: true,
    stats: "errors-only",
  },
  // 提出react和react-dom脚本
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/,
          name: "reactCommon",
          chunks: "all",
        },
      },
    },
    //将min.js文件压缩，production模式会压缩代码
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min_(.*)\.js$/,
        parallel: 4, //多线程多进程压缩
        // cache: true, //开启缓存
      }),
    ],
    //提出公共文件css或者js生成名为commons.*
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        vendors: {
          enforce: true,
        },
        commons: {
          name: "commons",
          chunks: "all",
          minChunks: 2,
        },
      },
    },
  },
  // stats: "errors-only",
  // proxy: {
  //   "/api": {
  //     target: "http://localhost:9092",
  //   },
  // },
})
