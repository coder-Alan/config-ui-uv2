<template>
  <view class="co-form">
    <template v-for="item in options">
      <view v-if="itemShowEvent(item)" :key="item.field" class="co-form__item">
        <CoFormNormal
          v-if="item.component === 'Normal'"
          v-model="modelValue[item.field]"
          :attrs="item"
          @click="onClick"
          @clear="onClear"
          @blur="onBlur"
        >
          <slot v-if="item.slot" :name="item.slotName"></slot>
        </CoFormNormal>
        <CoFormPicker
          v-else-if="item.component === 'Picker'"
          v-model="modelValue[item.field]"
          :attrs="item"
          @click="onClick"
          @clear="onClear"
        ></CoFormPicker>
        <CoFormCascader
          v-else-if="item.component === 'Cascader'"
          v-model="modelValue[item.field]"
          :attrs="item"
          @click="onClick"
        ></CoFormCascader>
        <CoFormUpload
          v-else-if="item.component === 'Upload'"
          ref="uploadBarRef"
          v-model="modelValue[item.field]"
          :attrs="item"
          :before-upload="beforeUpload"
          :before-remove="beforeRemove"
          @click="onClick"
        ></CoFormUpload>
        <CoFormCheckButton
          v-else-if="item.component === 'CheckButton'"
          v-model="modelValue[item.field]"
          :attrs="item"
          @click="onClick"
        ></CoFormCheckButton>
        <slot v-else-if="item.slot" :name="item.slotName"></slot>
      </view>
    </template>
  </view>
</template>

<script>
import CoFormNormal from '../co-form-normal/co-form-normal'
import CoFormPicker from '../co-form-picker/co-form-picker'
import CoFormCascader from '../co-form-cascader/co-form-cascader'
import CoFormUpload from '../co-form-upload/co-form-upload'
import CoFormCheckButton from '../co-form-check-button/co-form-check-button'

import formValidate from './validate.js'

/**
 * Form
 * @description 表单组件
 * @property {Object} v-model 表单数据对象
 * @property {Array<object>} options 表单项配置
 * 	@field {String} options.field 字段名
 * 	@field {String} options.component = [Normal|Picker|Cascader|Upload|CheckButton] 所需要用到的组件名
 * 		@value Normal CoFormNormal组件
 *  	@value Picker CoFormPicker组件
 * 		@value Cascader CoFormCascader组件
 * 		@value Upload CoFormUpload组件
 * 		@value CheckButton CoFormCheckButton组件
 * 	@field {Boolean} options.slot 是否使用插槽
 * 	@field {String} options.slotName 插槽名称
 * 	@field {Boolean} options.hidden 是否显示该表单项，比 showConfig 的优先级高
 * 	@field {Object} options.showConfig 显示条件
 *  	@field {String} options.showConfig.type = [all|anyOne] 对比方式
 *    	@value all 所有条件满足才显示
 * 			@value anyOne 任意一项满足就显示
 * 			@default all
 *    @field {Array<object>} options.showConfig.options 显示条件的配置项集合
 * 			@field {String|Array} options.showConfig.options.field 表单里某个对比字段，如果是数组，说明这个字段是对象里面的某个字段
 * 			@field {String} options.showConfig.options.terms = [===|!==|>|>=|<|<=|includes|!includes|null|!null] 表单里某个对比字段的条件
 * 				@value === 等于
 * 				@value !== 不等于
 * 				@value > 大于
 * 				@value >= 大于等于
 * 				@value < 小于
 * 				@value <= 小于等于
 * 				@value includes 包含
 * 				@value !includes 不包含
 * 				@value null 为空
 * 				@value !null 不为空
 * 				@default ===
 * 			@field {String|Number|Array} options.showConfig.options.value 表单里某个对比字段的值，如果是数组，说明这个字段是对象里面的某个字段
 * 	@field {Boolean} options.required 是否必填，默认为 false
 * 	@field {Object} options.rule 表单验证规则，具体配置可查看 validate.js
 * 		@field {RegExp} options.rule.reg 验证规则，正则表达式
 * 		@field {String} options.rule.message 验证失败提示信息
 * @property {Boolean} is-format 是否需要格式化数据，只保留 options 里的字段
 * 	@default true
 * @property {Function} before-upload 上传前的回调函数
 * @property {Function} before-remove 删除前的回调函数
 * ...其余配置为对应组件的配置，可到对应组件查看
 * @event change 当某个字段的值发生变化时触发
 * @event blur 当 CoFormNormal 组件里的 textarea 组件失去焦点时触发
 * @event clear 当点击 CoFormNormal 组件和 CoFormPicker 组件的清除按钮时触发
 * @event * 自定义事件名 对应组件的触发事件
 */

export default {
  name: 'CoForm',
  components: {
    CoFormNormal,
    CoFormPicker,
    CoFormCascader,
    CoFormUpload,
    CoFormCheckButton,
  },
  props: {
    value: {
      type: [Object, null],
      default: () => ({})
    },
    options: {
      type: Array,
      required: true,
      default: []
    },
    // 是否需要格式化数据
    isFormat: {
      type: Boolean,
      default: true
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
  computed: {
    modelValue: {
      get() {
        let data
        if (this.isFormat) {
          data = {}
        }
        else {
          data = { ...(this.value || {}) }
        }
        if (this.options.length && Object.keys(data).length !== this.options.length) {
          for (let i = 0; i < this.options.length; i++) {
            const field = this.options[i].field
            const value = this.value ? this.value[field] : ''
            if (value || typeof(value) === 'number') {
              data[field] = value
            }
            else {
              data[field] = undefined
            }
          }
          this.$emit('input', data)
        }
        return new Proxy(data, {
          set: (target, key, value) => {
            if (JSON.stringify(value) !== JSON.stringify(data[key])) {
              this.$emit('change', key, value)
            }

            Reflect.set(target, key, value)
            this.$emit('input', target)
            return true
          }
        })
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    onClick(methodName, item) {
      methodName = methodName || 'click'
      this.$emit(methodName, item)
    },
    onClear(e) {
      this.$emit('clear',e)
    },
    onBlur() {
      this.$emit('blur')
    },
    /**
     * 对整个表单的内容进行验证
     * @return {Promise} 校验结果
     */
    validate() {
      return new Promise((resolve, reject) => {
        const errorHandle = (title) => {
          uni.showToast({
            title,
            icon: 'none'
          })
          reject(`表单校验不通过！${title}！`)
          throw new Error()
        }

        for (let i = 0; i < this.options.length; i++) {
          if (!this.itemShowEvent(this.options[i])) continue
          const value = this.modelValue[this.options[i].field]
          if (this.options[i].required) {
            let notNull = false
            if (value) {
              // 如果值是个数组，且长度不等于 0 时才通过校验
              if (Reflect.toString.call(value) === '[object Array]') {
                if (value.length) notNull = true
              }
              // 如果值是个对象，且键值对的值长度不等于 0 时才通过校验
              else if (Reflect.toString.call(value) === '[object Object]') {
                if (Object.values(value).length) notNull = true
              }
              else notNull = true
            }
            !notNull && errorHandle(`${this.options[i].label}不能为空`)
          }
          if (this.options[i].rule) {
            let rule = this.options[i].rule
            if (typeof(rule) === 'string') {
              rule = formValidate[rule]
            }
            if (rule.reg.test(value)) continue
            errorHandle(rule.message)
          }
        }

        if (this.$refs.uploadBarRef) {
          for (let i = 0; i < this.$refs.uploadBarRef.length; i++) {
            if (this.$refs.uploadBarRef[i].checkIsUploading()) {
              errorHandle('请等待附件上传完成')
            }
          }
        }

        resolve(true)
      })
    },
    /**
     * 判断表单项是否可以展示
     * @param {Object} item 表单项配置
     * @return {Boolean}
     */
    itemShowEvent(item) {
      const { hidden, showConfig } = item
      // hidden 优先级比 showConfig 要高
      if (Reflect.has(item, 'hidden') && typeof hidden !== 'undefined') {
        return !hidden
      }
      else if (Reflect.has(item, 'showConfig') && typeof showConfig !== 'undefined') {
        // 如果没有 options 或者 options 的长度为 0，说明没有显示条件需要满足，返回 true
        if (!Reflect.has(showConfig, 'options') || !showConfig.options.length) return true

        let isShow
        const type = showConfig.type || 'all' // 比对类型，如果 type 的值为空，则默认为 all
        const options = showConfig.options

        // anyOne，数组任意一项通过就显示
        if (type === 'anyOne') {
          for (let i = 0; i < options.length; i++) {
            isShow = this.configHandler(options[i])
            if (isShow) break
          }
        }
        // all，数组每一项必须都通过才显示
        else {
          for (let i = 0; i < options.length; i++) {
            isShow = this.configHandler(options[i])
            if (!isShow) break
          }
        }

        return isShow
      }
      // 如果 hidden 和 showConfig 都没有，则默认显示，返回 true
      else {
        return true
      }
    },
    /**
     * 配置处理函数
     * @param {Object} config 显示配置
     * @return {Boolean} 是否显示
     */
    configHandler(config) {
      let value
      // 如果对比的表单值是个对象，则 field 必须是数组才能进行深度对比
      if (Reflect.toString.call(config.field) === '[object Array]') {
        try{
          value = JSON.parse(JSON.stringify(this.modelValue[config.field[0]]))
          for (let i = 1; i < config.field.length; i++) {
            value = value[config.field[i]]
          }
        }catch(e){
          //TODO handle the exception
        }
      }
      else {
        value = this.modelValue[config.field]
      }
      return this.termsHandler(config, value)
    },
    /**
     * 条件处理函数
     * @param {Object} config 显示配置
     * @param {String|number} value 表单值，config.value -> 比对值
     * @return {Boolean} 是否对该表单项进行渲染
     */
    termsHandler(config, value) {
      const terms = config.terms || '===' // 比对条件，如果 terms 的值为空，则默认为 ===（等于）
      // 等于
      if (terms === '===') {
        return value === config.value
      }
      // 不等于
      else if (terms === '!==') {
        return value !== config.value
      }
      // 大于
      else if (terms === '>') {
        return Number(value) > config.value
      }
      // 大于或等于
      else if (terms === '>=') {
        return Number(value) >= config.value
      }
      // 小于
      else if (terms === '<') {
        return Number(value) < config.value
      }
      // 小于或等于
      else if (terms === '<=') {
        return Number(value) <= config.value
      }
      // 包含
      else if (terms === 'includes') {
        return config.value.includes(value)
      }
      // 不包含
      else if (terms === '!includes') {
        return !config.value.includes(value)
      }
      // 为空
      else if (terms === 'null') {
        return Boolean(!value)
      }
      // 不为空
      else if (terms === '!null') {
        return Boolean(value)
      }
      // 如果 terms 不是以上类型，则直接返回 false
      else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.co-form {
  &__item {
    background: #FFFFFF;
  }
}
</style>
