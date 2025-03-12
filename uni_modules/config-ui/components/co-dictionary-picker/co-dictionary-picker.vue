<template>
	<CoPicker
		:show.sync="showModelValue"
		:title="title"
		:list="list"
		:multiple="multiple"
		:default-value="defaultValue"
		:clear="clear"
		label-key="dictName"
		value-key="dictValue"
		@clear="onClear"
		@confirm="onConfirm"
	></CoPicker>
</template>

<script>
import CoPicker from '../co-picker/co-picker'

import ConfigStore from '../../utils/config-store'

/**
 * DictionaryPicker
 * @description 字典选择器
 * @property {Boolean} show 是否显示选择器
 * @property {String} title 选择器标题
 * @property {String} dictName 字典名称
 * @property {Boolean} multiple 是否多选
 * @property {Boolean} clear 是否显示清除按钮
 * 	@default true
 * @property {String|Number|Object|Array} default-value 默认值
 * @event {Function} update:show 设置 showModelValue 的值时触发
 * @event {Function} confirm 点击确定按钮触发事件
 * @event {Function} clear 点击清除按钮触发事件
 */

export default {
	name: 'CoDictionaryPicker',
	components: {
		CoPicker,
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		dictName: {
			type: String,
			default: ''
		},
		multiple: {
			type: Boolean,
			default: false
		},
		clear: {
			type: Boolean,
			default: true
		},
		defaultValue: {
			type: [String, Number, Object, Array],
			default: ''
		},
	},
	computed: {
		showModelValue: {
			get() {
				return this.show
			},
			set(val) {
				this.$emit('update:show', val)
			}
		},
		list() {
			const dicMap = ConfigStore.dictionary[this.dictName]
			return dicMap ? Array.from(dicMap.values()) : dicMap
		}
	},
	created() {
		this.dictName && !this.list && ConfigStore.getDictMap(this.dictName)
	},
	methods: {
		onConfirm(e) {
			this.$emit('confirm', e)
		},
		onClear() {
			this.$emit('clear')
		},
	}
}
</script>
