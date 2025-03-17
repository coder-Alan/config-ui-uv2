<template>
	<CoPicker
		:show.sync="showModelValue"
		:title="title"
		:list="list"
		:multiple="multiple"
		:default-value="defaultValue"
		:clear="clear"
		:label-key="labelKey"
		:value-key="valueKey"
		@clear="onClear"
		@confirm="onConfirm"
	>
		<view v-if="loading" class="dict-loading">
			<view class="co-loading-circle"></view>
			<view class="loading-text">正在获取中...</view>
		</view>
		<view v-else class="tip-null">
			暂无数据
		</view>
	</CoPicker>
</template>

<script>
import CoPicker from '../co-picker/co-picker'

import ConfigStore from '../../utils/config-store'

/**
 * DictionaryPicker
 * @description 字典选择器
 * @property {Boolean} show 是否显示选择器
 * @property {String} title 选择器标题
 * @property {String} dictCode 字典编码
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
		dictCode: {
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
	data() {
		return {
			list: [],
			labelKey: ConfigStore.dictConfig.labelKey,
			valueKey: ConfigStore.dictConfig.valueKey,
			loading: false,
		}
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
	},
	created() {
		this.loading = true
		ConfigStore.getDictMap(this.dictCode)
			.then(dictMap => {
				this.list = Array.from(dictMap.values())
				this.loading = false
			})
			.catch(() => {
				this.loading = false
			})
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

<style lang="scss" scoped>
@import '../../styles/loading.scss';

.dict-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: rgba(#576b95, 0.8);

	.co-loading-circle {
		border-color: rgba(#576b95, 0.6);
	}

	.loading-text {
		margin-left: 10rpx;
	}
}

.tip-null {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	font-size: 28rpx;
	color: #aaa;
}
</style>
