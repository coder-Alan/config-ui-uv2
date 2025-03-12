<template>
	<view class="co-check-bar co-check" :class="{ checked: currChecked, disabled }" @click="onClick">
		<slot></slot>
	</view>
</template>

<script>
/**
 * CoCheckBar 复选栏
 * @property {String|Number|Object} data 复选栏数据，用于选中状态改变时回调参数返回
 * @property {Number} index 复选栏索引，用于选中状态改变时回调参数返回
 * @property {Boolean} disabled 是否禁用
 * @property {Boolean} multiple 是否多选
 * @property {Boolean} checked 当前是否勾选
 * @property {Boolean} cancelable 是否可取消选中
 * 	@default true
 * @event {Function} change 选中状态改变时触发，回调参数为 (data, checked, index)
 */

export default {
	name: 'CoCheckBar',
	props: {
		data: {
			type: [String, Object, Number],
			default: ''
		},
		index: {
			type: Number,
			default: 0
		},
		disabled: {
			type: Boolean,
			default: false
		},
		multiple: {
			type: Boolean,
			default: false
		},
		checked: {
			type: Boolean,
			default: false
		},
		cancelable: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			currChecked: false
		}
	},
	watch: {
		checked: {
			handler(val) {
				this.currChecked = val
			},
			immediate: true
		}
	},
	methods: {
		onClick() {
			if (this.disabled) return

			if (this.cancelable) {
				this.currChecked = !this.currChecked
			}
			this.$emit('change', this.data, this.currChecked, this.index)
		}
	}
}
</script>

<style lang="scss" scoped>
.co-check {
	position: relative;
}

.co-check[class*='checked']::after {
	content: '✓';
	position: absolute;
	right: 24rpx;
	top: 50%;
	transform: translateY(-50%);
	color: #1689F5;
	font-size: 34rpx;
	font-weight: bold;
}

.co-check[class*='disabled']::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(153, 153, 153, 0.5);
}
</style>
