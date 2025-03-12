import Vue from 'vue'

const ConfigStore = new Vue({
  data: {
    dictionary: {},
    dictConfig: {
      key: '', // 字典编码的字段名
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
  },
  methods: {
    init(params) {
      // TODO: Fetch dictionary from API
      params.dictConfig && Object.assign(this.dictConfig, params.dictConfig)
      params.uploadConfig && Object.assign(this.uploadConfig, params.uploadConfig)
      params.downloadConfig && Object.assign(this.downloadConfig, params.downloadConfig)
      params.geoConfig && Object.assign(this.geoConfig, params.geoConfig)

      this.systemInfo = this.getSystemInfo()
      this.env = this.getEnv()
      uni.onNetworkStatusChange(this.networkChange)
    },
    networkChange(res) {
      this.hasNet = res.isConnected
      this.networkType = res.networkType
    },
    getEnv() {
      let env = ''
      if (this.systemInfo.platform === 'devtools') {
        env = 'devtools'
      }
      // 企微打开小程序，企微登录
      else if (this.systemInfo.environment === 'wxwork') {
        env = 'QW'
      }
      // 微信打开小程序，微信登录
      else if (this.systemInfo.host.env === 'WeChat') {
        env = 'WX'
      }
      // 下面这一行代码，仅调试用
      // env = 'QW'
      return env
    },
    getSystemInfo() {
      return wx.getSystemInfoSync()
    },
    /**
     * 获取字典并存储到 ConfigStore 中
     * @param {String} code 字典编码
     * @return {Promise} 返回字典Map
     */
    getDictMap(code) {
      return new Promise((resolve, reject) => {
				let count = 0
        /**
         * 获取字典。
         * 如果获取失败，则会重新请求，至多请求3次，都失败则返回失败信息。
         */
				const getMap = () => {
					if (count === 3) {
						return reject('字典调用失败：' + dictTypeCodes)
					}
					count += 1
					this.dictConfig.getFun(code)
						.then(res => {
              // list 字典列表
              const { list } = res
							if (!list || !list.length) return getMap()
							const dicMap = new Map()
							for (let i = 0; i < list.length; i++) {
								dicMap.set(list[i][this.dictConfig.key], list[i])
							}
              this.dictionary[code] = dicMap
							resolve(dicMap)
						})
						.catch(err => {
							console.warn(err)
							getMap()
						})
				}

				const dictMap = state[dictTypeCodes]
        // 如果字典已经请求过，则直接返回
				if ((dictMap && dictMap.size > 0) || Reflect.has(this.dictionary, code)) {
					return resolve(this.dictionary[code])
				}
        // 创建该字典的key，为了方便判断该字典是否已经请求过
        this.dictionary[code] = undefined
				getMap()
			})
    },
    /**
     * 获取省份数据，如果没有获取地理信息的接口，则不会执行获取
     */
    getProvince() {
      if (!this.geoConfig.getFun) return

      this.geoConfig.getFun()
        .then(res => {
          this.province = res
        })
    },
    /**
     * 缓存已获取的地理信息数据
     * @param {String} type 城市、区域 city area
     * @param {String} code 区域编码
     * @param {Array} list 地理信息列表
     */
    setGeoData(type, code, list) {
      const data = {}
      for (let i = 0; i < list.length; i++) {
        data[list[i][this.geoConfig.key]] = list[i]
      }
      this[type][code] = data
    },
    setZIndex(number) {
      this.maxZIndex = number
    }
  }
})

export default ConfigStore
