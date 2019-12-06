# vue-spliterprj
<<<<<<< HEAD
vue+elementui 项目搭建
=======

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
# zcc 2019/8/12
# 命名规范

1、组件命名  使用kebab-case（短横线）  component-a
  全局注册
  Vue.component('component-a', { /* ... */ })
  <!-- 在 html 模板中始终使用 kebab-case -->
  <div id="app">
    <component-a></component-a>
  </div>
2、文件命名
文件名统一采用驼峰式  mHeader.vue
页面中import引入的名称与注册组件时的名字保持一致，使用首字母大写
import MHeader from 'components/mHeader/mHeader'
export default {
  name: 'app'
  components: {
    MHeader,
    Tab
  }
}
3、css
划线命名 <p class="nav-wrap"></p>

# 目录结构

├── README.md                     项目介绍
├── index.html                    入口页面
├── build                         构建脚本目录
│  ├── build-server.js            运行本地构建服务器，可以访问构建后的页面
│  ├── build.js                   生产环境构建脚本
│  ├── dev-client.js              开发服务器热重载脚本，主要用来实现开发阶段的页面自动刷新
│  ├── dev-server.js              运行本地开发服务器
│  ├── utils.js                   构建相关工具方法
│  ├── webpack.base.conf.js       wabpack基础配置
│  ├── webpack.dev.conf.js        wabpack开发环境配置
│  └── webpack.prod.conf.js       wabpack生产环境配置
├── config                        项目配置
│  ├── dev.env.js                 开发环境变量
│  ├── index.js                   项目配置文件
│  ├── prod.env.js                生产环境变量
│  └── test.env.js                测试环境变量
├── package.json                  npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
├── src                           源码目录
│  ├── main.js                    入口js文件
│  ├── app.vue                    根组件
│  ├── components                 公共组件目录
│  │  ├── common                  公共组件
│  │  ├── header                  头部组件
│  │  └── directive               自定义指令
│  │
│  ├── assets                     资源目录，这里的资源会被wabpack构建
│  │  ├── styles
│  │  │   ├── index.scss
│  │  │   └── reset.scss           样式重置
│  │  │
│  │  └── js                      页面自行开发的js
│  │     ├── api                  接口相关
│  │     ├── lib                  页面js
│  │     └── util                 工具js
│  │
│  ├── routes                     前端路由
│  │  └── index.js
│  ├── i18n                       国际化
│  │  ├── langs                   语言包
│  │  └── i18n.js
│  ├── plugins                    引用的插件
│  │
│  ├── router                     前端路由
│  │  └── index.js
│  └── views                      页面目录
│     ├── accredit                授权页
│     │   ├── accredit.vue        主页面
│     │   └── children            页面组件
│     ├── equipment               设备页
│     ├── pixel                   分辨率
│     ├── save                    保存页
│     ├── scene                   场景页
│     ├── screen                  显示屏
│     └── window                  多窗口
│
├── static                        纯静态资源，不会被wabpack构建。
   ├── images                     图片
   ├── download                   下载
   └── iconfont                   图标库

vuex待定

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
>>>>>>> first commit
