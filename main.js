import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

import ConfigStore from './uni_modules/config-ui/utils/config-store'

ConfigStore.init({
  dictConfig: {
    labelKey: 'dictName', // 字典值对应的中文名的字段名
    valueKey: 'dictValue', // 字典值的字段名
    getFun: (code) => { // {Function} 获取字典的接口，args: code 字典编码
      return new Promise((resolve, reject) => {
        // mock data
        setTimeout(() => {
          if (code === 'DICT_NAME_CODE') {
            resolve([
              { dictName: '字典项1', dictValue: '1' },
              { dictName: '字典项2', dictValue: '2' },
              { dictName: '字典项3', dictValue: '3' },
              { dictName: '字典项4', dictValue: '4' },
            ])
          }
          else {
            resolve([
              { dictName: '其他', dictValue: '0' },
            ])
          }
        }, 5000)
      })
    },
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
    key: 'code', // 地理信息编码的字段名
    value: 'name', // 地理信息编码对应的中文名的字段名
    getFun: (code) => { // {Function} 获取地理信息接口, args: code 区域编码, args 为空时查全部省份，需返回 Promise.resolve(Array) 类型。
      return new Promise((resolve, reject) => {
        // mock data
        setTimeout(() => {
          if (!code) {
            resolve([
              { code: '110000', name: '北京市' },
              { code: '130000', name: '河北省' },
              { code: '140000', name: '山西省' },
              { code: '150000', name: '内蒙古自治区' },
            ])
          }
          else if (code === '110000') {
            resolve([
              { code: '110100', name: '北京市' },
            ])
          }
          else if (code === '110100') {
            resolve([
              { code: '110101', name: '东城区' },
              { code: '110102', name: '西城区' },
              { code: '110105', name: '朝阳区' },
            ])
          }
          else if (code === '130000') {
            resolve([
              { code: '130100', name: '石家庄市' },
              { code: '130200', name: '唐山市' },
              { code: '130300', name: '秦皇岛市' },
            ])
          }
          else if (code === '130100') {
            resolve([
              { code: '130102', name: '长安区' },
              { code: '130104', name: '桥西区' },
              { code: '130105', name: '新华区' },
            ])
          }
          else {
            resolve([])
          }
        }, 3000);
      })
    },
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