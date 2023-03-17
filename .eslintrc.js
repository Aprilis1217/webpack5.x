module.exports = {
  // 继承 Eslint 规则
  extends: ['eslint:recommended'],
  env: {
    node: true, // 启用 node 中全局变量
    browser: true // 启用浏览器中全局变量
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  workingDirectories: ["./dist"],
  rules: {
    "no-var": "error" // 不能使用 var 定义变量
  }
}