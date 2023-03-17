// todo Webpack 是现在 JavaScript 应用程序的静态模块打包器 (module bundler)
// 当 webpack 在处理应用程序时，会递归的构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle

/**
 * Webpack5.x 五个核心概念
 * todo 1. entry 入口：指示 webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图
 * todo 2. output 输出：指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名，默认值为 ./dist
 * todo 3. loader: loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack自身只理解JavaScript）
 * todo 4. plugins 插件：plugins 可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等
 * todo 5. mode 模式：指示 webpack 使用相应模式的配置
 *    - development 开发模式：会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlguin 和 NamedModulesPlugin
 *    - production 生产模式：会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin
 */

/**
 * index.js 文件为 webpack 入口起点文件
 * 运行指令：
 *   开发环境：webapck ./src/index.js -o ./dist --mode=development
 *      上述意思就是 webpack 会以 ./src/index.js 为入口起点文件开始打包，打包输出到 ./dist 整体打包环境是开发环境
 *   生产环境：webpack ./src/index.js -o ./dist/bundle.js --mode=production
 *      上述意思就是 webpack 会以 ./src/index.js 为入口起点文件开始打包，打包输出到 ./dist 整体打包环境是生产环境
 *
 * todo 结论：webpack 自身(不依赖其它 loader 和 plugins)只能处理 js 和 json 文件；开发环境和生产环境都能将 ES6 模块化编译成浏览器能识别的模块化
 */

// 引入 json 文件
import data from './data.json'

// 引入 index.css 文件
import './index.css'
// 引入 index.less 文件
import './index.less'

// 引入 count.js 文件
import count from './count'

console.log(count(5, 3))

const TestFn = (x, y) => {
  return x + y
}

console.log(TestFn(1, 4))

console.log(data)
/*global Promise*/
/*eslint no-undef: "error"*/
const promise = new Promise((reslove) => {
  setTimeout(() => {
    console.log('执行了 Promise 中的定时器')
    reslove()
  })
})

console.log(promise, 'Promise')

console.log('呼啦啦~~~')

// todo 注册 serviceWorker ---> 渐进式网络开发应用程序（离线访问）
// serviceWorker 必须运行在服务器上
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }

