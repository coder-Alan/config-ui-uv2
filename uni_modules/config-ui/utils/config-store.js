import Vue from 'vue'

const ConfigStore = new Vue({
  data: {
    dictionary: {}, // 字典, key: 字典编码, value: 字典数据
    dictConfig: {
      labelKey: 'dictName', // 字典值对应的中文名的字段名
      valueKey: 'dictValue', // 字典值的字段名
      getFun: undefined, // {Function} 获取字典的接口，args：code 字典编码
    },
    uploadConfig: {
      url: '', // 上传接口
      header: {}, // 请求头
      success: undefined, // {Function} 上传成功后的回调，args：res、resolve、reject，需返回 resolve 或者 reject。
    },
    downloadConfig: {
      header: {}, // HTTP 请求的 Header，Header 中不能设置 Referer
      timeout: 1000 * 60 * 5, // 5分钟
      filePath: undefined, // 指定文件下载后存储的路径 (本地路径)
      getUrlFun: undefined, // {Function} 获取下载路径，args：fileId 文件id，需返回 String 类型 url。
    },
    geoConfig: {
      key: '', // 地理信息编码的字段名
      value: '', // 地理信息编码对应的中文名的字段名
      getFun: undefined, // {Function} 获取地理信息接口, args：code 区域编码, args 为空时查全部省份，需返回 Promise.resolve(Array) 类型。
    },
    province: {}, // 省份, key: 省份区域编码, value: 省份数据
    city: {}, // 城市, key: 省份区域编码, value: {Object} 该省份的城市集合
    area: {}, // 区域, key: 城市区域编码, value: {Object} 该城市的区域集合
    hasNet: true, // 是否有网络
    networkType: '', // 网络类型
    env: '', // 环境类型
    maxZIndex: 10, // 默认 z-index 最大索引
    systemInfo: {}, // 系统信息
    windowInfo: {}, // 窗口信息
  },
  methods: {
    init(params) {
      // TODO: Fetch dictionary from API
      params.dictConfig && Object.assign(this.dictConfig, params.dictConfig)
      params.uploadConfig && Object.assign(this.uploadConfig, params.uploadConfig)
      params.downloadConfig && Object.assign(this.downloadConfig, params.downloadConfig)
      params.geoConfig && Object.assign(this.geoConfig, params.geoConfig)

      this.windowInfo = uni.getWindowInfo()
      this.systemInfo = this.getSystemInfo()
      this.env = this.getEnv()
      uni.onNetworkStatusChange(this.networkChange)
    },
    networkChange(res) {
      this.hasNet = res.isConnected
      this.networkType = res.networkType
    },
    getEnv() {
      const types = {
        SDK: 'QW', // 企微打开小程序
        WeChat: 'WX', // 微信打开小程序
      }

      // 下面这一行代码，仅调试用
      // return 'QW'
      return types[this.systemInfo.env]
    },
    getSystemInfo() {
      const deviceInfo = uni.getDeviceInfo()
      const appBaseInfo = uni.getAppBaseInfo()

      return {
        platform: deviceInfo.platform, // 客户端平台, "devtools": 开发者工具, "ios": iOS, "android": Android
        brand: deviceInfo.brand, // 设备品牌
        model: deviceInfo.model, // 设备型号
        system: deviceInfo.system, // 操作系统及版本
        env: appBaseInfo.host.env, // 当前小程序运行的宿主环境
        SDKVersion: appBaseInfo.SDKVersion, // 客户端基础库版本
        language: appBaseInfo.language, // 微信设置的语言
        version: appBaseInfo.version, // 微信版本号
        fontSizeScaleFactor: appBaseInfo.fontSizeScaleFactor, // 微信字体大小缩放比例
        fontSizeSetting: appBaseInfo.fontSizeSetting, // 微信字体大小，单位px
      }
    },
    /**
     * 获取字典并存储到 ConfigStore 中
     * @param {String} code 字典编码
     * @return {Promise} 返回字典Map
     */
    getDictMap(code) {
      if (!this.dictConfig.getFun) throw new Error('请配置字典获取函数');
      if (!code) throw new Error('请传入字典编码');

      return new Promise((resolve, reject) => {
        // 如果字典库里面存在字典名，说明这个字典正在获取中或者已经获取完成，直接返回
        if (Reflect.has(this.dictionary, code)) {
          const dictMap = this.dictionary[code]
          if (Reflect.toString.call(dictMap) === '[object Map]' && dictMap.size > 0) {
            // 字典已经获取完成，则直接返回
            resolve(dictMap)
          }
          else {
            // 字典正在获取中，则监听字典获取完成再返回
            const mapWatch = this.$watch(
              () => {
                return this.dictionary[code]
              },
              (dicMap) => {
                if (dicMap) {
                  mapWatch()
                  resolve(dicMap)
                }
              },
              {
                immediate: true,
              }
            )
          }
          return;
        }

				let count = 0
        /**
         * 获取字典。
         * 如果获取失败，则会重新请求，至多请求3次，都失败则返回失败信息。
         */
				const getMap = () => {
					if (count === 3) {
						return reject('字典调用失败：' + code)
					}
					count += 1
					this.dictConfig.getFun(code)
						.then((list = []) => {
              // list 字典列表
							if (!list || !list.length) return getMap()
							const dicMap = new Map()
							for (let i = 0; i < list.length; i++) {
								dicMap.set(list[i][this.dictConfig.valueKey], list[i])
							}
              this.dictionary[code] = dicMap
							resolve(dicMap)
						})
						.catch(err => {
							console.warn(err)
							getMap()
						})
				}

        // 创建该字典的key，为了方便判断该字典是否已经请求过
        this.$set(this.dictionary, code, undefined)
				getMap()
			})
    },
		/**
		 * 根据上级区域的区域编码获取下级区域数据，当code为空时说明获取的是省级数据
		 * @param {String} code 上级区域的区域编码
		 * @return {Array} 下级区域数组
		 */
    getGeoData(code) {
      if (!this.geoConfig.getFun) throw new Error('请配置地理信息获取函数');

      return new Promise((resolve, reject) => {
        this.geoConfig.getFun(code)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    /**
     * 缓存已获取的地理信息数据
     * @param {String} type 城市、区域 province/city/area
     * @param {String} code 区域编码
     * @param {Array} list 地理信息列表
     */
    setGeoData({ type, code, list }) {
      const data = {}
      for (let i = 0; i < list.length; i++) {
        data[list[i][this.geoConfig.key]] = list[i]
      }

      if (type === 'province') {
        this.province = data
      }
      else {
        this[type][code] = data
      }
    },
    setZIndex(number) {
      this.maxZIndex = number
    }
  }
})

export default ConfigStore
