import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

import ConfigStore from './uni_modules/config-ui/utils/config-store'

ConfigStore.init({
  dictConfig: {
    key: '', // 字典编码的字段名
    getFun: (code) => {}, // {Function} 获取字典的接口，args: code 字典编码
  },
  uploadConfig: {
    url: '', // 上传接口
    header: {}, // 请求头
    success: ({ res, resolve, reject }) => {}, // {Function} 上传成功后的回调，args: res、resolve、reject，需返回 resolve 或者 reject。
  },
  downloadConfig: {
    header: {}, // HTTP 请求的 Header，Header 中不能设置 Referer
    timeout: 1000 * 60 * 5, // 5分钟
    filePath: '', // 指定文件下载后存储的路径 (本地路径)
    getUrlFun: (fileId) => {}, // {Function} 获取下载路径，args: fileId 文件id，需返回 String 类型 url。
  },
  geoConfig: {
    key: '', // 地理信息编码的字段名
    value: '', // 地理信息编码对应的中文名的字段名
    getFun: (code) => {}, // {Function} 获取地理信息接口, args: code 区域编码, args 为空时查全部省份，需返回 Promise.resolve(Array) 类型。
  },
})

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif