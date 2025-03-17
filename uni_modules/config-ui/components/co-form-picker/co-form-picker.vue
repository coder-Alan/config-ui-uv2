<template>
	<view class="co-form-picker">
		<CoFormNormal
			v-model="valueName"
			:attrs="config"
			:loading="loading"
			@click="onClick"
			@clear="onClear(false)"
		></CoFormNormal>
		<CoDictionaryPicker
			v-if="config.pickerType === 'dictionary'"
			:show.sync="showSelect"
			:title="config.label"
			:dict-code="config.dictCode"
			:multiple="config.multiple"
			:default-value="modelValue"
			:clear="!config.required"
			@confirm="onConfirm"
			@clear="onClear"
		></CoDictionaryPicker>
		<CoTimePicker
			v-else-if="['time', 'month'].includes(config.pickerType)"
			:show.sync="showSelect"
			:type="config.pickerType"
			@confirm="onConfirm"
			@clear="onClear"
		></CoTimePicker>
		<CoDatetimePicker
			v-else-if="['date', 'datetime', 'daterange', 'datetimerange'].includes(config.pickerType)"
			:show.sync="showSelect"
			:type="config.pickerType"
			:start-date="config.startDate"
			:end-date="config.endDate"
			:default-value="modelValue"
			:clear="!config.required"
			@confirm="onConfirm"
			@clear="onClear"
		></CoDatetimePicker>
		<CoAreaPicker
			v-else-if="config.pickerType === 'area'"
			:show.sync="showSelect"
			:emit-path="config.emitPath"
			@confirm="onConfirm"
			@clear="onClear"
		></CoAreaPicker>
		<CoPicker
			v-else-if="config.pickerType === 'default' || !config.pickerType"
			:show.sync="showSelect"
			:title="config.label"
			:list="config.list"
			:label-key="config.labelKey"
			:value-key="config.valueKey"
			:multiple="config.multiple"
			:default-value="modelValue"
			:clear="!config.required"
			@confirm="onConfirm"
			@clear="onClear"
		></CoPicker>
	</view>
</template>

<script>
import CoFormNormal from '../co-form-normal/co-form-normal'
import CoPicker from '../co-picker/co-picker'
import CoDictionaryPicker from '../co-dictionary-picker/co-dictionary-picker'
import CoTimePicker from '../co-time-picker/co-time-picker'
import CoAreaPicker from '../co-area-picker/co-area-picker'
import CoDatetimePicker from '../co-datetime-picker/co-datetime-picker'

import { getDicName } from '../../utils/index.js'

/**
 * FormPicker
 * @description 表单选择器，form组件的内置组件，合并了CoPicker、CoDictionaryPicker、CoTimePicker、CoDatetimePicker、CoAreaPicker组件
 * @property {String|Number|Object|Array} v-model 绑定值
 * @property {Object} attrs 属性配置
 * 	@field pickerType = [default|dictionary|time|month|date|datetime|daterange|datetimerange|area] 选择器类型
 * 		@value default 默认选择器
 * 		@value dictionary 字典选择器
 * 		@value time 时间选择器
 * 		@value month 年月选择器
 * 		@value date 日期选择器
 * 		@value datetime 日期时间选择器
 * 		@value daterange 日期范围选择器
 * 		@value datetimerange 日期时间范围选择器
 * 		@value area 地区选择器
 * 		@default default
 *  @field {String} returnType = [value|label|object] 返回值类型
 * 	 	@value value 返回值
 * 	 	@value label 返回标签
 * 	 	@value object 返回对象
 * 		@default value
 *  @field {String} label 标签内容 【CoFormNormal、CoDictionaryPicker、CoPicker】
 *  @field {String} dictCode 字典编码 【CoDictionaryPicker】
 *  @field {Boolean} multiple 是否多选 【CoDictionaryPicker、CoPicker】
 *  @field {Boolean} required 是否必填 【CoDictionaryPicker、CoPicker、CoDatetimePicker】
 *  @field {String|Number} startDate 开始日期 【CoDatetimePicker】
 *  @field {String|Number} endDate 结束日期 【CoDatetimePicker】
 *  @field {Array<object>} list 选项列表 【CoPicker】
 *  @field {String} labelKey 标签字段名 【CoPicker】
 *  @field {String} valueKey 值字段名 【CoPicker】
 *  @field {String} emitPath 是否返回由该节点所在的省市区的值所组成的数组，若设置 false，则只返回最后一级区域的数据 【CoAreaPicker】
 * 	@field ... CoFormNormal 组件的属性
 * @event clear 当点击 CoPicker 组件的清除按钮触发或者点击 CoFormNormal 组件里面的 Arrow 组件的清除按钮触发
 * @event click 当点击 CoFormNormal 组件里面的 CoFormLabel 组件的图标触发
 */

export default {
	name: 'CoFormPicker',
	components: {
		CoFormNormal,
		CoPicker,
		CoDictionaryPicker,
		CoTimePicker,
		CoAreaPicker,
		CoDatetimePicker,
	},
	props: {
		value: {
			type: [String, Number, Object, Array],
			default: ''
		},
		attrs: {
			type: [Object, null],
			default: () => ({})
		}
	},
	data() {
		return {
			showSelect: false,
			valueName: '',
			optionMap: new Map(), // 仅 pickerType = default 生效，用于快速获取选项的label
			isSelfChange: false, // 是否是内部改变数据
			loading: false, // 字典选择器是否加载中
		}
	},
	computed: {
		modelValue: {
			get() {
				return this.value
			},
			set(val) {
				this.$emit('input', val)
			}
		},
		config() {
			const defaultAttrs = {
				pickerType: 'default',
				labelKey: 'label',
				valueKey: 'value',
				label: '',
				labelStyle: '',
				placeholder: '',
				disabled: false,
				borderAlign: 'bottom',
				list: [],
				dictCode: '',
				returnType: 'value',
				multiple: false,
			}
			const newAttrs = Object.assign(defaultAttrs, this.attrs, {
				labelType: 'arrow'
			})

			return newAttrs
		}
	},
	watch: {
		'config.list': {
			handler(val) {
				if (!val.length) return

				const optionMap = new Map()
				for (let i = 0; i < val.length; i++) {
					optionMap.set(val[i][this.config.valueKey], val[i])
				}
				this.optionMap = optionMap
			},
			immediate: true
		},
		modelValue: {
			handler(newVal) {
				// 如果不是自身主动改变，则说明是外部数据的传入，需要回显
				if (!this.isSelfChange) {
					this.getValueName()
				}
				else {
					this.isSelfChange = false
				}
			},
			immediate: true
		}
	},
	methods: {
		getValueName() {
			if (!this.modelValue) {
				return this.valueName = ''
			}

			const { pickerType } = this.config
			if (pickerType === 'dictionary') {
				this.getDictionaryPickerLabel()
			}
			else if (['datetime', 'time', 'date', 'area'].includes(pickerType)) {
				this.valueName = this.modelValue
			}
			else if (pickerType === 'default') {
				this.getDefaultPickerLabel()
			}
		},
		async getDictionaryPickerLabel() {
			let valueName = ''
			const data = this.modelValue
			const { returnType, dictCode, multiple } = this.config

			if (Reflect.toString.call(data) === '[object Object]') {
				if (Reflect.has(data, 'label')) {
					if (data.label) {
						valueName = data.label
					}
					else if (data.value) {
						this.loading = true
						valueName = await getDicName(data.value, dictCode)
            this.modelValue = {
              label: valueName,
              value: data.value
            }
						this.loading = false
					}
				}
        this.valueName = valueName
				return
			}

			this.loading = true
			if (multiple) {
				const valueNames = []
				for (let i = 0; i < data.length; i++) {
					const name = await getDicName(data[i], dictCode)
					valueNames.push(name)
				}
				valueName = valueNames.join(',')
			}
			else {
				valueName = await getDicName(data, dictCode)
			}
			this.valueName = valueName
			this.loading = false

			if (returnType === 'object') {
				this.modelValue = {
					label: valueName,
					value: data
				}
			}
		},
		getDefaultPickerLabel() {
			const data = this.modelValue

			if (Reflect.toString.call(data) === '[object Object]') {
				if (Reflect.has(data, 'label')) {
					this.valueName = data.label
				}
				else {
					this.valueName = ''
				}
				return
			}

			let valueName = ''
			const { labelKey, returnType, multiple } = this.config

			if (multiple) {
				const valueNames = []
				for (let i = 0; i < data.length; i++) {
					const option = this.optionMap.get(data[i])
					const name = option ? option[labelKey] : ''
					valueNames.push(name)
				}
				valueName = valueNames.join(',')
			}
			else {
				const option = this.optionMap.get(data)
				valueName = option ? option[labelKey] : ''
			}
			this.valueName = valueName

			if (returnType === 'object') {
				this.modelValue = {
					label: valueName,
					value: data
				}
			}
		},
		onConfirm(e) {
			this.isSelfChange = true
			this.valueName = e.label || ''

			if (this.config.returnType === 'object') {
				this.modelValue = e
			}
			else {
				this.modelValue = e[this.config.returnType]
			}
		},
		onClear(isPickerClear = true) {
			this.isSelfChange = true

			if (isPickerClear) {
				this.valueName = ''
			}

			if (this.config.returnType === 'object') {
				this.modelValue = {
					label: undefined,
					value: undefined
				}
			}
			else {
				this.modelValue = undefined
			}

			this.$emit('clear', this.attrs)
		},
		onClick(e) {
			if (e) {
				this.$emit('click', e, this.attrs)
			}
			else {
				this.showSelect = true
			}
		}
	}
}
</script>
