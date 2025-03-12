<template>
	<view class="co-form-cascader">
		<CoFormNormal
			v-model="valueName"
			:attrs="config"
			@click="onClick"
			@clear="onClear(false)"
		></CoFormNormal>
		<CoCascader
			:show.sync="showCascader"
			:title="title"
			:options="config.options"
			:label-key="config.labelKey"
			:value-key="config.valueKey"
			:emit-path="config.emitPath"
			:clear="!config.required"
			@confirm="onConfirm"
			@clear="onClear"
		></CoCascader>
	</view>
</template>

<script>
import CoFormNormal from '../co-form-normal/co-form-normal'
import CoCascader from '../co-cascader/co-cascader'

/**
 * FormCascader
 * @description 级联选择器，form组件的内置组件，用于多层级的数据选择
 * @property {String|Number|Object|Array} v-model 绑定的值
 * @property {Object} attrs 组件属性配置
 * 	@field {Boolean} disabled 是否禁用
 * 	@field {Array<object>} options 数据列表
 * 	@field {String} labelKey 标签字段名
 * 	@field {String} valueKey 值字段名
 * 	@field {String} returnType = [value|object] 选中的返回类型
 * 		@value value 只返回数据的值
 * 		@value object 返回完整数据
 * 		@default value
 * 	@field {Boolean} showAllLevels 是否显示选中值的完整路径
 * 	@field {Boolean} emitPath 是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
 * 	@field ... CoFormNormal 组件的属性
 * @event clear 当点击 CoPicker 组件的清除按钮触发或者点击 CoFormNormal 组件里面的 Arrow 组件的清除按钮触发
 * @event click 当点击 CoFormNormal 组件里面的 CoFormLabel 组件的图标触发
 */

export default {
	name: 'CoFormCascader',
	components: {
		CoFormNormal,
		CoCascader,
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
			showCascader: false,
			valueName: '',
			selfChange: false // 是否是内部改变数据
		}
	},
	computed: {
		config() {
			const defaultAttrs = {
				label: '',
				labelStyle: '',
				placeholder: '',
				disabled: false,
				borderAlign: 'bottom',
				labelKey: 'label',
				valueKey: 'value',
				options: [],
				returnType: 'value',
				showAllLevels: true,
				emitPath: true,
			}

			const newAttrs = Object.assign(defaultAttrs, this.attrs)
			newAttrs.labelType = 'arrow'

			return newAttrs
		},
		modelValue: {
			get() {
				return this.value
			},
			set(val) {
				this.$emit('input', val)
			}
		},
		title() {
			return `请选择${this.config.label}`
		}
	},
	watch: {
		modelValue: {
			handler() {
				// 如果不是自身主动改变，则说明是外部数据的传入，需要回显
				if (!this.selfChange) {
					this.valueName = this.getValueName()
				}
				else {
					this.selfChange = false
				}
			},
			immediate: true
		}
	},
	methods: {
		getValueName() {
			if (!this.modelValue
			|| (Array.isArray(this.modelValue) && !this.modelValue.length)
			|| (typeof this.modelValue === 'object' && !Object.keys(this.modelValue).length))
			return ''

			let path = []
			// 获取选中值对应的label
			const arrTraverser = (options, data) => {
				for (let i = 0; i < options.length; i++) {
					const value = options[i][this.config.valueKey]
					if (value === data[0]) {
						path.push(options[i])
						if (options[i].children && data.length > 1) {
							arrTraverser(options[i].children, data.slice(1))
							break
						}
						else {
							return
						}
					}
				}
			}
			const strTraverser = (options, currPath, data) => {
				for (var i = 0; i < options.length; i++) {
					const value = options[i][this.config.valueKey]
					if (this.modelValue === value) {
						return path = currPath.push(options[i])
					}
					if (options[i].children) {
						strTraverser(options[i].children, currPath.push(options[i]), data)
					}
					else {
						return
					}
				}
			}

			let list
			if (Array.isArray(this.modelValue)) {
				if (this.config.returnType === 'object') {
					list = this.modelValue
				}
				else {
					arrTraverser(this.config.options, this.modelValue)
					list = path
				}
				list = list
			}
			else {
				if (this.config.returnType === 'object') {
					strTraverser(this.config.options, [], this.modelValue[this.config.valueKey])
				}
				else {
					strTraverser(this.config.options, [], this.modelValue)
				}
				list = path
			}
			return this.formatLabel(list)
		},
		formatLabel(list) {
			if (this.config.showAllLevels) {
				return list.map(item => item[this.config.labelKey]).join(' / ')
			}
			else {
				return list[list.length - 1][this.config.labelKey]
			}
		},
		onClick(e) {
			if (e) {
				this.$emit('click', e, this.attrs)
			}
			else {
				this.showCascader = true
			}
		},
		onConfirm(e) {
			this.selfChange = true

			if (this.config.emitPath) {
				if (this.config.returnType === 'object') {
					this.modelValue = e
				}
				else {
					this.modelValue = e.map(item => item[this.config.returnType])
				}

				this.valueName = this.formatLabel(e)
			}
			else {
				if (this.config.returnType === 'object') {
					this.modelValue = e
				}
				else {
					this.modelValue = e[this.config.returnType]
				}

				this.valueName = e.label || ''
			}
		},
		onClear(isPickerClear = true) {
			this.selfChange = true

			if (isPickerClear) {
				this.valueName = ''
			}

			if (this.config.emitPath) {
				this.modelValue = []
			}
			else {
				if (this.config.returnType === 'object') {
					this.modelValue = {
						label: undefined,
						value: undefined
					}
				}
				else {
					this.modelValue = undefined
				}
			}

			this.$emit('clear', this.attrs)
		},
	}
}
</script>
