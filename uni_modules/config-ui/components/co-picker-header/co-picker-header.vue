<template>
	<view class="co-picker-header">
		<slot v-if="$slots.default"></slot>
		<view v-else class="header-title co-singe-ellipsis">{{ title }}</view>
		<view v-if="clear" class="header-left">
			<text @click="$emit('clear')">清空</text>
		</view>
		<view class="header-right">
			<view v-if="!$slots.right && confirm" class="confirm" @click="$emit('confirm')">确认</view>
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
/**
 * PickerHeader
 * @description 选择器头部
 * @property {String} title 标题
 * @property {Boolean} clear 是否可以清空，默认是true
 * 	@default true
 * @property {Boolean} confirm 是否显示确定按钮，默认是true
 * 	@default true
 */

export default {
	name: 'CoPickerHeader',
	props: {
		title: {
			type: [String, null],
			default: ''
		},
		clear: {
			type: Boolean,
			default: true
		},
		confirm: {
			type: Boolean,
			default: true
		}
	}
}
</script>

<style lang="scss" scoped>
.co-picker-header {
	position: relative;
	// display: flex;
	// align-items: center;
	// justify-content: center;
	height: 88rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	border-bottom: 1rpx solid #eee;
	box-sizing: border-box;

	.header-left {
		position: absolute;
		left: 24rpx;
		top: 50%;
		transform: translateY(-50%);
		color: #969799;
	}

	.header-title {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 0 80rpx;
		text-align: center;
		overflow: hidden;
		box-sizing: border-box;
	}

	.header-right {
		position: absolute;
		right: 24rpx;
		top: 50%;
		transform: translateY(-50%);

		.confirm {
			color: #576b95;
		}
	}
}
</style>
