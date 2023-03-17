/**
 * webpack.config.js 文件是 webpack 的配置文件
 *
 * todo 作用：指示 webpack 怎么做，做哪些事（当你运行 webpack 指令时，会加载里面的配置）
 *
 * todo 注意点：所有的构建工具都是基于 nodejs 平台运行的，默认遵循 commonjs 规范
 *
 * loader: 1. 下载 2. 使用（配置 loader）
 * plugins: 1. 下载 2. 引入插件 3. 使用插件
 *
 *
 * todo 处理 css 浏览器兼容性问题
 *    下载插件 postcss postcss-loader postcss-preset-env
 *    postcss 找到 package.json 中 browserslist 里面的配置，通过配置指定加载 css 兼容性样式
 *    "browserslist": {
        // 开发环境--->设置 node 环境变量：process.env.NODE_ENV = 'development'
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ],
        // todo 生产环境：默认是看生产环境
        "production": [
          ">0.1%",
          "not dead",
          "not op_mini all"
        ]
      }
 *
 *
 * todo 处理 js 浏览器兼容性问题
 *    下载 babel-loader @babel-core @babel/preset-env core-js
 *    基本 js 兼容性处理 ---> @babel/preset-env
 *    todo @babel/preset-env 解决不了复杂的，比如 Promise
 *    按需加载处理 js 兼容性问题：core-js
 *
 * todo 慎用：暴力解决兼容性 ---> 缺点是将所有兼容性代码全部引入，体积太大
 *    下载 @babel/polyfill
 *
 *
 *
 * todo 缓存：（针对的是生产环境构建打包时）
 * todo babel 缓存： cacheDirectory: true 开启了 babel 缓存 ---> 针对 js 文件，让第二次打包速度更快
 *      文件资源缓存：
 *        hash: 每次 webpack 构建时会生成一个唯一的 hash 值
 *          问题：因为 js 和 css 使用的共同的一个 hash 值，这样就会导致我若是只修改了 js 文件，再重新打包，会导致所有缓存失效
 *        chunkhash: 根据 chunk 生成的 hash 值，如果打包来源于同一个 chunk，那么 hash 值还是一样的
 *          问题：js 和 css 的 hash 值还是一样的，因为 css 是在 js 中被引入的，同属于一个 chunk（代码块）
 * todo   contenthash: 根据文件的内容生成的 hash 值，不同文件的 hash 值肯定是不一样的 ---> 让线上代码运行缓存更好使用
 *
 * ? asset/resource 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能
 * ? asset/inline 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能
 * ? asset/source 将资源导出为源码（source code）. 类似的 raw-loader 功能
 * ? asset 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource
 * * type: "asset/inline" 资源会以内联的形式加载打包进去，但是不回现在图片的大小都会以这种base64的形式，也会导致html体积过大。
 * * type: "asset", 是自动的，默认会判断资源的大小，当资源文件大于8k，就当 asset/resource, 小于就是"asset/inline"
 *
 * todo PWA: 渐进式网络开发应用程序（离线访问）---> 插件 workbox-webpack-plugin
 */
/**
 * todo 安装 babel
 *    ? babel-loader: 使用 babel 和 webpack 来转译 js 文件
 *    ? @babel/core: babel 的核心模块
 *    ? @babel/preset-env: 转译 ES2015 的语法
 *    ? @babel/preset-react: 转译 react 的 jsx 语法
 *    ? @babel/plugin-proposal-class-properties: 用来编译类 (class)
 *    ? @babel/plugin-transform-runtime: 防止污染全局，代码复用和减少打包体积
 */


// resolve 用来拼接绝对路径的方法
const { resolve } = require('path')

// 引入插件 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 导入 terser-webpack-plugin --> 减少js体积(其中删除js的console.log和注释)
const TerserWebpackPlugin = require('terser-webpack-plugin');
// 引入提取css文件成为单独的文件的插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 引入压缩css文件的插件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
// 引入 eslint-webpack-plugin 检测 js jsx 插件
const ESlintWebpackPlugin = require('eslint-webpack-plugin')

// 引入 workbox-webpack-plugin 插件，渐进式网络开发应用程序（离线访问）
// const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

// 引入插件 clean-webpack-plugin
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// todo 设置 nodejs 的环境变量，决定 package.json 中的 browserslist 使用哪个环境
// process.env.NODE_ENV = 'development'

// 复用 loader
const commonCssLoader = [
  // css 提取文件成为单独的文件，就不需要使用 style-loader，需要使用插件
  // 'style-loader', // style-loader 创建一个 style 标签，将 js 中的样式资源插入进去，添加到 head 中生效
  MiniCssExtractPlugin.loader, // 创建link标签，引入样式文件
  {
    loader: "css-loader", // css-loader 将 css 文件变成 commonjs 模块加载到 js 中，里面的内容是样式字符串的形式
    options: {
      // @import的css文件，回头能被前面的"less-loader"、"postcss-loader"处理
      importLoaders: 2
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      // Webpack4.x 写法
      // ident:'postcss',
      // plugins: () => [
      //   require('postcss-preset-env')()
      // ]
      // todo Webpack5.x 写法
      postcssOptions: {
        plugins: [
          'postcss-preset-env'
        ]
      }
    }
  }
]

/**
 * TODO entry 入口起点
 * 1. string ---> './src/index.js'
 *    单入口，打包形成一个 chunk, 输出一个 bundle 文件
 *    此时 chunk 的名称默认是 main
 *
 * 2. array ---> ['./src/index.js', './src/add.js']
 *    多入口，所有入口文件最终打包只会形成一个 chunk, 输出也只有一个 bundle 文件
 *
 * 3. object
 *    多入口，有几个文件就会生成几个 chunk, 输出几个 bundle 文件
 *    此时 chunk 的名称就是 key 的名称
 */

// webpack 配置信息
module.exports = {
  // 指定入口起点文件
  entry: './src/index.js',
  // entry: ['./src/index.js', './src/add.js'],
  // entry: {
  //   index: './src/index.js',
  //   add: './src/add.js'
  // },
  // 输出
  output: {
    // 输出的文件名（指定文件名称和目录）
    filename: '[name].js', // name 默认名称为 main, 若是 entry 是个对象，那这个 name 值就是对象中的 key 值
    // filename: './dist/index.js',
    // 输出的路径（将来所有输出的公共目录）
    path: resolve(__dirname, 'dist'), // todo __dirname nodejs 的一个变量，代表当前文件目录的绝对路径
    // publicPath: '/', // todo 所有资源引入公共路径的前缀，一般用于生产环境
    // chunkFilename: '[name]_chunk', // todo 给打包输出其它文件命名
    library: '[name]', // 整个库向外暴露的变量名
    libraryTarget: 'window', // 变量名挂载到哪个上面
    // 告诉 webpack 在生成的运行时代码中可以使用什么样的 es 特性
    environment: {
      arrowFunction: false, // 配置 webpack 不使用箭头函数
      const: false // 不使用 const
    },
    // assetModuleFilename: 'images/[hash][ext][query]',
    clean: true // 清除上次打包出来的文件
  },
  /**
   * 最佳配置选择：
   *    development: 'eval-cheap-module-source-map'
   *    production: 'cheap-module-source-map'
  */
  devtool: 'eval-cheap-module-source-map',
  // devtool: 'source-map', // todo source-map 外部生成 map，会有错误代码的准确信息和源代码的错误位置
  // 生产环境下：nosources=source-map(全部隐藏)、hidden-source-map(只隐藏源代码，会提示构建后代码的错误信息)
  // todo 模式配置信息 开发环境和生产环境
  mode: 'development',
  // mode: 'production',
  // todo 配置缓存 cache ---> 打包更高效
  cache: { // 默认缓存的文件将存储到 node_moudles/.cache/webpack
    type: 'filesystem', // filesystem 磁盘缓存 memory 内存缓存
    buildDependencies: {
      // This makes all dependencies of this file - build dependencies
      config: [__filename],
      // By default webpack and loaders are build dependencies
    },
  },
  // todo 开发服务器 devServer 用来自动化（自动编译、自动打开浏览器、自动刷新浏览器）
  // 注意点：开发服务器不会输出资源，在内存中编译打包的
  devServer: {
    // static 项目构建后的路径，也就是代码要运行的项目目录
    static: resolve(__dirname, 'dist'),
    // compress 是否启动 gzip 压缩，让代码体积更小，速度更快
    compress: true,
    host: 'localhost', // 启动开发服务器域名
    // port 指定开发服务器的端口号
    port: 8888,
    // open 是否自动打开默认的浏览器
    open: true,
    hot: true, // 热更新
    // 使用 History 路由模式时，若404错误时被替代为 index.html
    historyApiFallback: true,
    // 服务器代理，解决开发环境的跨域问题
    proxy: {
      //定义一个标记，如以后api开头的请求都走代理的设置
      '/api': {
        // 要请求的真实服务端基地址 相当于被/api替代了
        target: 'https://...',
        // 把api重写为空，因为别人没有 /api
        pathRewrite: { "^/api": "" },
        // 发送请求头中host会设置成target
        changeOrigin: true
      }
    }
  },
  target: 'web', // 默认值 web webpack5.x 加上之后热更新才有效果
  /* 设置模块如何被解析 */
  resolve: {
    /* 自动解析确定的扩展,频率高的文件尽量写在前面，import 引入这些类型文件时这些扩展名可以省略 */
    extensions: ['.js', '.vue', '.json', '.ts', '.jsx', '.tsx'],
    /* 别名 */
    alias: {
      '@': resolve('src')
    },
    // 告诉 webpack 解析模块去哪个目录
    modules: [resolve(__dirname, 'src'), 'node_modules']
  },
  /**
   * todo oneOf 中的 loader 只会匹配其中的一个
   *     注意：oneOf 中不能有两个或以上的配置处理同一种类型文件
   * todo oneOf 用来优化生产环境打包构建速度
  */
  // todo 加载器
  module: {
    // todo loader 的配置信息
    rules: [
      {
        oneOf: [
          // 处理 js 兼容
          {
            test: /\.js$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        "useBuiltIns": 'usage', // todo 使用 corejs 的方式 usage 表示按需加载
                        "corejs": '3', // 指定下载的 corejs 版本
                        targets: {
                          "chrome": '60',
                          "firefox": '60',
                          "ie": '9',
                          "safari": '10',
                          "edge": '17'
                        }
                      }
                    ]
                  ],
                  /**
                   * webpack4.x 写法，开启 babel 缓存，第二次构建时就会读取之前的缓存
                   * cacheDirectory: true
                   */
                }
              }
            ],
            exclude: /node_modules/
          },
          // 详细的 loader 配置
          // css 文件的处理
          {
            test: /\.css$/, // test 利用正则匹配哪些文件
            use: [ // todo 使用哪里 loader 进行处理，数组中的执行顺序：从右到左，从下到上依次执行
              // css 提取文件成为单独的文件，就不需要使用 style-loader，需要使用插件
              // 'style-loader', // style-loader 创建一个 style 标签，将 js 中的样式资源插入进去，添加到 head 中生效
              MiniCssExtractPlugin.loader, // 创建link标签，引入样式文件
              'css-loader', // css-loader 将 css 文件变成 commonjs 模块加载到 js 中，里面的内容是样式字符串的形式
              {
                loader: 'postcss-loader',
                options: {
                  // Webpack4.x 写法
                  // ident:'postcss',
                  // plugins: () => [
                  //   require('postcss-preset-env')()
                  // ]
                  // todo Webpack5.x 写法
                  postcssOptions: {
                    plugins: [
                      'postcss-preset-env'
                    ]
                  }
                }
              },
            ],
            exclude: /node_modules/
          },
          // less 文件的处理
          {
            test: /\.less$/,
            use: [
              ...commonCssLoader,
              'less-loader' // less-loader 将 less 文件编译成 css 文件
            ],
            exclude: /node_modules/
          },
          // 图片静态文件的处理
          {
            test: /\.(?:ico|png|jpg|gif|jpeg|webp|svg)$/,
            type: 'asset', // 将其分割为单独的文件，并导出 url
            generator: {
              filename: 'static/images/[name]_[contenthash:10].[ext]'
            },
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024 // 限制 10K 小于10k的图片会转换称 base64 能减少http请求
              }
            },
            exclude: /node_modules/
          },
          // 对于 svg|eot|ttf|woff|woff2 字体静态资源使用 asset/inline 类型内联一些数据
          {
            test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
            type: 'asset/inline',
            exclude: /node_modules/
          },
          // todo 处理 html 文件中引入的资源
          {
            test: /\.html$/,
            loader: 'html-loader', // 处理html文件的img图片（负责引入img，从而能被 url-loader 进行处理）
            exclude: /node_modules/
          },
        ]
      }
    ]
  },
  // todo plugins 插件配置信息
  plugins: [
    // 详细的插件配置
    // todo html-webpack-plugin 插件：默认会创建一个空的 HTML 文件，自动引入打包输出的所有资源
    new HtmlWebpackPlugin({
      // 配置 template 模板，指定模板文件的相对路径，并自动引入打包输出所有的资源
      template: resolve(__dirname, 'public/index.html'),
      // todo 压缩 html 代码
      minify: {
        collapseWhitespace: true, // 移除空格
        removeComments: true, // 移除注释
        removeEmptyAttributes: true, // 移除空属性
        collapseBooleanAttributes: true, // 移除checked类似的布尔值属性
        removeAttributeQuotes: true, // 移除属性上的双引号
        minifyCSS: true, // 压缩内嵌式的css代码（只能基本压缩，不能自动添加前缀）
        minifyJS: true, // 压缩内嵌式的js代码（不能转码）
        removeStyleLinkTypeAttributes: true, // 移除style和link标签上的type属性
        removeScriptTypeAttributes: true // 移除script标签上的默认属性
      }
    }),
    // todo 压缩css文件
    new CssMinimizerPlugin(),
    // todo 提取css文件成为单独的文件的插件
    new MiniCssExtractPlugin({
      // 生成单独的 css 文件重命名
      filename: 'static/css/main.[contenthash:10].css'
    }),
    new ESlintWebpackPlugin({
      // 检测哪些文件
      context: resolve(__dirname, 'src')
    })
    // 利用插件生成一个 service-worker.js 配置文件
    // new WorkboxWebpackPlugin.GenerateSW({
    //   // 帮助 serviceWorker 快速启动；删除旧的 serviceWorker
    //   clientsClaim: true,
    //   skipWaiting: true
    // })
    // 每次打包时清空输出文件夹的文件
    // new CleanWebpackPlugin()
  ],
  /* 压缩js */
  optimization: {
    minimize: true,
    // todo 代码分割配置
    splitChunks: {
      chunks: 'all',
      // 以下是默认值
      // minSize: 20000, // 分割代码最小的大小
      // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      // maxInitialRequests: 30, // 入口js文件最大并行请求数量
      // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      // cacheGroups: { // 组，哪些模块要打包到一个组
      //   defaultVendors: { // 组名
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
      //     priority: -10, // 权重（越大越高）
      //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      //   },
      //   default: { // 其他没有写的配置会使用上面的默认值
      //     minChunks: 2, // 这里的minChunks权重更大
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
    },
    minimizer: [
      // todo 配置生产环境的压缩方案 js 和 css
      // 说明：安装了 css-minimizer-webpack-plugin 插件后，webpack 默认的 production 环境下的压缩 js 会失效，因此安装 terse-webpack-plugin
      new TerserWebpackPlugin({
        // 开启多线程打包
        parallel: true,
        // 不将注释提取到单独的文件中
        extractComments: false,
        terserOptions: {
          compress: {
            // drop_console: true, // 清除 console
            // drop_debugger: false, // 清除 debugger
            // pure_funcs: ['console.log'] // 移除 console
          }
        },
      }),
    ],
  },
  performance: {
    hints: 'warning', // 枚举 false关闭
    maxEntrypointSize: 50000000, // 最大入口文件大小
    maxAssetSize: 30000000, // 最大资源文件大小
    assetFilter: function (assetFilename) { //只给出 js 文件的性能提示
      return assetFilename.endsWith('.js');
    }
  }
}





