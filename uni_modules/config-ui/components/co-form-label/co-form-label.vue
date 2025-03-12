<template>
	<view v-if="config.label" class="co-form-label" :class="{ 'is-required': config.required }" :style="boxStyle">
		<view class="label">{{ config.label }}</view>
		<view class="icon-list">
			<view v-for="(item, index) in config.labelIconList" :key="index">
				<CoSvgIcon
					v-if="item.icon"
					class="icon"
					:icon="item.icon"
					:color="item.color"
					:size="item.size"
					:style="item.style"
					@click="onClick(item.method)"
				></CoSvgIcon>
			</view>
		</view>
	</view>
</template>

<script>
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

/**
 * FormLabel
 * @description 表单标签，form组件的内置组件
 * @property {Object} config 配置项
 * 	@field {String} label 标签内容
 * 	@field {String} labelColor 标签颜色
 * 	@field {String} labelSize 标签大小
 * 	@field {String} layout = [horizontal|vertical] 标签布局
 * 		@value horizontal 水平布局
 * 		@value vertical 垂直布局
 * 		@default horizontal
 * 	@field {Boolean} required 是否必填，用于标记星号
 * 	@field {Array<object>} labelIconList 标签图标列表
 * 		@field {String} icon 图标
 * 		@field {String} color 图标颜色
 * 		@field {String} size 图标大小
 * 		@field {String} style 图标样式
 * 		@field {String} method 点击图标时触发的方法名
 * 	@field {String} boxStyle 标签容器样式
 * @event iconClick 点击标签图标时触发
 * @example <co-form-label config="{}"></co-form-label>
 */

export default {
	name: 'CoFormLabel', 
	components: {
		CoSvgIcon,
	},
	props: {
		config: {
			type: [Object, null],
			required: true,
			default: () => ({})
		}
	},
	computed: {
		boxStyle() {
			const style = `color: ${this.config.labelColor};
			font-size: ${this.config.labelSize};
			${this.config.layout === 'horizontal' ? 'max-width: calc(50vw - 32rpx); margin-right: 24rpx;' : 'margin-bottom: 12rpx;'}
			${this.config.boxStyle}`

			return style.replace(/\s+/g, ' ')
		}
	},
	methods: {
		onClick(methodName) {
			if (!methodName) return

			this.$emit('iconClick', methodName)
		}
	}
}
</script>

<style lang="scss" scoped>
.co-form-label {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;

	.label {
		padding-top: 4rpx;
	}

	.icon-list {
		display: flex;
		align-items: center;
	}

	.icon {
		padding-top: 2rpx;
	}
}

.is-required {
	position: relative;

	&::after {
		content: '*';
		position: absolute;
		left: -20rpx;
		top: 50%;
		transform: translateY(-30%);
		color: #FF3141;
		font-size: 30rpx;
	}
}
</style>
