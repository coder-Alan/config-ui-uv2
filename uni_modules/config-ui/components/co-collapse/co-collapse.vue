<template>
	<view class="co-collapse" :class="customClass">
		<view class="co-collapse__cell" @click="handleChange">
			<view class="co-collapse__cell-left">
				<view v-if="iconPosition === 'left'" class="co-collapse__cell-left__icon">
					<CoSvgIcon
						icon="arrowUp"
						size="16"
						color="#CCC"
						:custom-class="['co-collapse__icon', isOpen ? 'co-collapse__icon-rotate' : '']"
					></CoSvgIcon>
				</view>
				<view v-if="!$slots.title" class="co-collapse__title">{{ title }}</view>
				<slot v-else name="title"></slot>
			</view>
			<view @click.stop>
				<slot name="right"></slot>
			</view>
			<view
				v-if="iconPosition === 'right'"
				class="co-collapse__cell-right__icon"
			>
				<CoSvgIcon
					icon="arrowUp"
					size="16"
					color="#CCC"
					:custom-class="['co-collapse__icon', isOpen ? 'co-collapse__icon-rotate' : '']"
				></CoSvgIcon>
			</view>
		</view>
		<view class="co-collapse__content" :class="isOpen ? 'is-open' : 'is-close'">
			<slot></slot>
		</view>
	</view>
</template>

<script>
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

/**
 * Collapse
 * @description 折叠面板
 * @property {String} title 标题
 * @property {String} custom-class 自定义class
 * @property {Boolean} open 是否默认是打开状态
 * @property {String} icon-position = [left|right] 展开图标的位置
 * 	@value left 左侧
 * 	@value right 右侧
 * 	@default right
 * @event open 当折叠面板打开时触发
 * @event close 当折叠面板关闭时触发
 */

export default {
	name: 'CoCollapse',
	components: {
		CoSvgIcon,
	},
	options: {
		styleIsolation: 'shared'
	},
	props: {
		title: {
			type: String,
			default: '标题'
		},
		customClass: {
			type: String,
			default: ''
		},
		// 默认是否是打开状态
		open: {
			type: Boolean,
			default: false
		},
		// 展开图标的位置
		iconPosition: {
			type: String,
			default: 'right'
		}
	},
	data() {
		return {
			isOpen: false,
		}
	},
	created() {
		this.isOpen = this.open
	},
	methods: {
		handleChange() {
			this.isOpen = !this.isOpen
			if (this.isOpen) {
				this.$emit('open')
			}
			else {
				this.$emit('close')
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.co-collapse {
	background: #FFFFFF;
	overflow: hidden;

	&__cell {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 90rpx;
		padding: 16rpx 24rpx;
		border-top: 1rpx solid #EEEEEE;
		border-bottom: 1rpx solid #EEEEEE;
		box-sizing: border-box;

		&-left {
			display: flex;
			align-items: center;
			flex: 1;
			overflow: hidden;

			&__icon {
				padding-right: 10rpx;
			}
		}
	}

	&__title {
		color: #333333;
		font-size: 32rpx;
	}

	::v-deep .co-collapse__icon {
		transition: all .2s;
	}

	::v-deep .co-collapse__icon-rotate {
		transform: rotate(180deg);
	}

	.is-open {
		display: block;
	}

	.is-close {
		display: none;
	}
}
</style>
