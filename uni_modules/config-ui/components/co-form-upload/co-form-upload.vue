<template>
  <view class="co-form-upload" :class="barClass" :style="config.customStyle">
    <CoFormLabel :config="config" @iconClick="onClick"></CoFormLabel>
    <UploadImage
      v-if="config.uploadType === 'image'"
      :value="uploadList"
      :config="config"
      @statusChange="onStatusChange"
      @delete="onDelete"
      @upload="onUpload"
    ></UploadImage>
    <UploadFile
      v-else-if="['file', 'video'].includes(config.uploadType)"
      :value="uploadList"
      :config="config"
      @statusChange="onStatusChange"
      @delete="onDelete"
      @upload="onUpload"
    ></UploadFile>
  </view>
</template>

<script>
import CoFormLabel from '../co-form-label/co-form-label'
import UploadImage from './upload-image'
import UploadFile from './upload-file'

import { handleUpload, getFileInfo } from '../../utils/file-handler.js'
import ConfigStore from '../../utils/config-store.js'

/**
 * FormUpload
 * @description 表单上传，form组件的内置组件，支持图片、视频和文件上传
 * @property {Array<object>|String} v-model 已上传的文件列表，格式为[{url: 'http://xxx', uploadInfo: {}}]或字符串
 * @property {Object} attrs 组件属性
 *  @field {String} uploadType = [image|file|video] 上传类型
 *    @value image 图片
 *    @value file 文件
 *    @value video 视频
 *    @default image
 *  @field {Object} uploadConfig 上传配置
 *  @field {Number} max 最多上传多少张图片
 *    @default 1
 *  @field {Boolean} required 是否必填
 *  @field {Boolean} disabled 是否禁用
 *  @field {String} placeholder 待上传时的占位符，仅 uploadType = file/video 生效
 *  @field {String} customStyle 自定义样式
 *  @field {Array<object>} customActionSheet 自定义菜单按钮，格式为[{label: '*', value: '*'}]
 *  @field {Boolean} allowOfflineUpload 是否允许在断网情况下上传
 * 	@field ... CoFormLabel 组件的属性
 * @property {Function} before-upload 上传文件之前的钩子，参数为上传的文件，若返回 Promise 且被 reject，则停止上传。
 * @property {Function} before-remove 删除文件之前的钩子，参数为上传的文件和上传列表，若返回 Promise 且被 reject，则停止上传。
 * @event fulfilled 上传成功后触发
 * @event uploadRemove 删除上传文件后触发
 * @event * 自定义事件名 当点击 CoFormLabel 组件的图标触发
 * @event * 自定义事件名 点击自定义菜单时触发
 */

export default {
  name: 'CoFormUpload',
  components: {
    CoFormLabel,
    UploadImage,
    UploadFile,
  },
  props: {
    value: {
      type: [Array, String],
      default: []
    },
    attrs: {
      type: Object | null,
      default: () => ({})
    },
    beforeUpload: {
      type: Function,
      default: () => {
        return () => Promise.resolve()
      }
    },
    beforeRemove: {
      type: Function,
      default: () => {
        return () => Promise.resolve()
      }
    },
  },
  data() {
    return {
      uploadList: [], // 上传列表
      isSelfChange: false, // 是否是内部改变数据
    }
  },
  computed: {
    modelValue: {
      get() {
        let list = []
        if (this.isSelfChange) {
          list = this.uploadList
        }
        else {
          // 如果 value 的类型是Array，则检测每一项是否是对象
          if (Object.prototype.toString.call(this.value) === '[object Array]') {
            for (let i = 0; i < this.value.length; i++) {
              const item = this.value[i]
              let uploadData
              if (typeof(item) === 'object') {
                if (item.url) uploadData = item
                else {
                  uploadData = {
                    url: item.fileId,
                    uploadInfo: item,
                    status: 'fulfilled'
                  }
                }
              }
              else if (typeof(item) === 'string') {
                uploadData = {
                  url: item,
                  status: 'fulfilled'
                }
              }
              uploadData && list.push(this.formatUploadData(uploadData))
            }
          }
          // 如果 value 的类型是 String ，则自动转换为 Array
          else if (Object.prototype.toString.call(this.value) === '[object String]' && this.value) {
            list.push(this.formatUploadData({
              url: this.value,
              status: 'fulfilled'
            }))
          }
        }
        return new Proxy(list, {
          set: (target, key, value) => {
            this.isSelfChange = true
            Reflect.set(target, key, value)
            this.uploadList = [...target]
            this.$emit('input', this.formatUploadedList())
            return true
          }
        })
      },
      set(val) {
        this.isSelfChange = true
        this.uploadList = val
        this.$emit('input', this.formatUploadedList())
      }
    },
    config() {
      const defaultAttrs = {
        label: '',
        labelSize: '32rpx',
        labelColor: '#999',
        labelStyle: '',
        labelIcon: '',
        labelIconStyle: '',
        borderAlign: 'bottom',
        layout: 'horizontal',
        max: 1,
        required: false,
        disabled: false,
        uploadType: 'image',
        placeholder: '',
        customStyle: '',
        uploadConfig: {
          count: 1,
          sourceType: ['album', 'camera'],
          sizeType: ['compressed'],
        },
        customActionSheet: [],
        allowOfflineUpload: false,
      }

      const newAttrs = Object.assign(defaultAttrs, this.attrs)
      newAttrs.uploadConfig.count = newAttrs.max ? newAttrs.max > 1 && newAttrs.max <= 9 ? newAttrs.max : 9 : 1 // 多选，最多可以同时选择的图片张数，最多9张

      return newAttrs
    },
    barClass() {
      return [
        this.config.borderAlign ? `co-border-${this.config.borderAlign}` : ''
      ]
    },
    hasNet() {
      return ConfigStore.hasNet
    },
    env() {
      return ConfigStore.env
    },
    systemInfo() {
      return ConfigStore.systemInfo
    },
    // 图片的压缩质量
    compressionQuality() {
      let quality = 50
      switch (this.systemInfo.platform){
        case 'android':
          quality = 50
          break;
        case 'ios':
          quality = 30
          break;
      }
      return quality
    }
  },
  methods: {
    formatUploadedList() {
      const list = this.uploadList
        .filter(item => item.status === 'fulfilled')
        .map(item => item.uploadInfo)
      return list
    },
    onUpload() {
      if (this.config.disabled) return

      if (this.config.uploadType === 'image') {
        this.handleChooseImage()
      }
      else if (this.config.uploadType === 'file') {
        this.handleChooseFile()
      }
      else if (this.config.uploadType === 'video') {
        uni.chooseVideo({
          ...this.config.uploadConfig,
          success: (res) => {
            this.upload({
              path: res.tempFilePath,
              size: res.size,
              name: `${new Date().getTime()}.${res.tempFilePath.split('.').reverse()[0]}`
            })
          }
        })
      }
    },
    getActionSheet() {
      const customActionSheet = this.config.customActionSheet

      let actionSheet
      if (this.config.uploadType === 'image') {
        actionSheet = [
          { label: '拍摄', value: 'camera' },
          { label: '从相册选择', value: 'album' },
        ]
      }
      else if (this.config.uploadType === 'file') {
        actionSheet = [
          { label: '拍摄', value: 'camera' },
          { label: '从相册选择', value: 'album' },
          { label: '从聊天选择', value: 'message' },
        ]
      }

      if (Reflect.toString.call(customActionSheet) === '[object Array]') {
        actionSheet = actionSheet.concat(customActionSheet)
      }

      return actionSheet
    },
    handleChooseImage() {
      const actionSheet = this.getActionSheet()
      const list = actionSheet.filter(item => this.config.uploadConfig.sourceType.includes(item.value))

      uni.showActionSheet({
        itemList: list.map(item => item.label),
        success: (res) => {
          this.customChooseImage([list[res.tapIndex].value])
        },
        fail: (res) => {
          console.warn(res.errMsg)
        }
      })
    },
    customChooseImage(sourceType) {
      uni.chooseImage({
        ...this.config.uploadConfig,
        sourceType,
        success: async (res) => {
          // 压缩图片
          const compressList = [] // 压缩列表
          for (let i = 0; i < res.tempFiles.length; i++) {
            let path
            try{
              // 压缩的临时路径
              const { tempFilePath } = await uni.compressImage({
                src: res.tempFiles[i].path,
                quality: this.compressionQuality
              })
              path = tempFilePath
            }catch(e){
              path = res.tempFiles[i].path
            }

            const { digest: md5, size } = await getFileInfo(path)
            compressList.push({
              ...res.tempFiles[i],
              path,
              md5,
              size
            })
          }

          this.batchUpload(compressList)
        }
      })
    },
    handleChooseFile() {
      const list = this.getActionSheet()

      uni.showActionSheet({
        itemList: list.map(item => item.label),
        success: (res) => {
          const action = list[res.tapIndex].value

          if (['camera', 'album'].includes(action)) {
            this.customChooseImage([action])
          }
          else if (action === 'message') {
            const chooseFile = (api) => {
              api({
                type: 'file',
                extension: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt'],
                ...this.config.uploadConfig,
                success: (res) => {
                  this.batchUpload(res.tempFiles)
                }
              })
            }

            if (this.env === 'QW') {
              wx.qy.checkSession({
                success: () => {
                  chooseFile(wx.qy.chooseMessageFile)
                },
                fail: () => {
                  uni.showToast({
                    title: '企微登录已过期',
                    icon: 'error'
                  })
                }
              })
            }
            else {
              chooseFile(wx.chooseMessageFile)
            }
          }
          else {
            this.$emit('click', action)
            this.$emit(action)
          }
        }
      })
    },
    /**
     * 单个上传处理方法
     * @param {Object} data 本地临时文件信息
     * @param {String} data.path 本地临时文件路径 (本地路径)
     * @param {Number} data.size 本地临时文件大小，单位 B
     */
    async upload(data) {
      const newData = this.formatUploadData({
        status: 'pending',
        md5: data.md5,
        url: data.path,
        uploadInfo: {
          fileName: data.name
        }
      })

      try {
        await this.beforeUpload([newData])
      } catch (err) {
        throw new Error(err?.message)
      }

      const index = this.modelValue.length
      this.modelValue[index] = newData

      let uploadedData
      try {
        uploadedData = await this.handleModelValue(index)
      } catch (err) {
        throw new Error(err?.message)
      }

      return uploadedData
    },
    /**
     * 批量上传处理方法
     * @param {Object} list 文件集合
     */
    async batchUpload(list = []) {
      if (!list.length) return

      const modelValue = [ ...this.modelValue ] || []
      const oldLength = modelValue.length

      try {
        await this.beforeUpload(list)
      } catch (err) {
        throw new Error(err?.message)
      }

      for (let i = 0; i < list.length; i++) {
        modelValue.push(this.formatUploadData({
          status: 'pending',
          md5: list[i].md5,
          url: list[i].path,
          uploadInfo: {
            fileName: list[i].name
          }
        }))
      }

      this.modelValue = modelValue

      for (let i = 0; i < list.length; i++) {
        this.handleModelValue(i + oldLength)
      }
    },
    handleModelValue(index) {
      return new Promise((resolve, reject) => {
        this.$nextTick(async () => {
          // 无网络状态
          if (!this.hasNet) {
            // 如果允许在断网情况下上传，则直接将状态置为'uploaded'
            // 以便在网络恢复后，可以继续上传
            if (this.config.allowOfflineUpload) {
              this.modelValue[index] = {
                ...this.modelValue[index],
                status: 'uploaded'
              }
              return resolve(this.modelValue[index])
            }
            else {
              this.modelValue[index] = {
                ...this.modelValue[index],
                status: 'rejected'
              }
              return reject('当前检测到是断网状态，无法上传文件')
            }
          }

          let uploadRes = null
          try {
            uploadRes = await handleUpload({ path: this.modelValue[index].url })
          }
          catch (err) {
            console.warn(err)
          }

          if (uploadRes) {
            this.modelValue[index] = {
              ...this.modelValue[index],
              uploadInfo: {
                fileName: uploadRes.fileName,
                fileSize: uploadRes.fileSize,
                fileId: uploadRes.fileId,
              },
              status: 'uploaded'
            }
          }
          else {
            this.modelValue[index] = this.formatUploadData({
              ...this.modelValue[index],
              status: 'rejected'
            })
          }

          resolve(uploadRes)
        })
      })
    },
    onStatusChange(index) {
      const item = this.modelValue[index]
      item.status = 'fulfilled'
      this.$emit('click', 'fulfilled', item)
      this.modelValue[index] = item
    },
    async onDelete(index) {
      const delData = JSON.parse(JSON.stringify(this.modelValue[index]))

      try {
        await this.beforeRemove(delData, this.modelValue)
      } catch (err) {
        throw new Error(err?.message)
      }

      if (this.config.max === 1) {
        this.modelValue = []
      } else {
        this.modelValue.splice(index, 1)
      }

      this.$emit('click', 'uploadRemove', delData)
    },
    validate() {
      if (this.modelValue.length) {
        return true
      } else {
        return false
      }
    },
    onClick(e) {
      this.$emit('click', e, this.attrs)
    },
    formatUploadData(data) {
      const defaultData = {
        status: '',
        url: '',
        md5: '',
        uploadInfo: null
      }
      return Object.assign(defaultData, data)
    },
    /**
     * 检查当前是否有附件正在上传中
     */
    checkIsUploading() {
      return this.modelValue.some(item => item.status === 'pending')
    }
  }
}
</script>

<style lang="scss" scoped>
.co-form-upload {
  padding: 24rpx 24rpx 24rpx 32rpx;
  background-color: #FFFFFF;
}
</style>
