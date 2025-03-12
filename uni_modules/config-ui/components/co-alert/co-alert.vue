<template>
	<view :style="alertStyle" class="co-alert">
		<CoSvgIcon
			v-if="showIcon"
			:icon="newIcon"
			:size="iconSize"
			:color="newIconColor"
		></CoSvgIcon>
		<text :class="showIcon ? 'co-alert__main' : ''">{{ title }}</text>
	</view>
</template>

<script>
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

/**
 * Alert
 * @description 警告
 * @property {String} title Alert 标题
 * @property {String} type = [success|info|warning|error] Alert 类型
 * 	@value success 成功
 * 	@value info 信息
 * 	@value warning 警告
 * 	@value error 错误
 * 	@default info
 * @property {String} color 文字颜色
 * @property {String} background-color 背景颜色
 * @property {String} custom-style 自定义样式
 * @property {Boolean} show-icon 是否显示图标
 * 	@default true
 * @property {String} icon 自定义图标
 * @property {Number} icon-size 图标大小
 * @property {String} icon-color 图标颜色
 * @property {String} effect = [light|dark] 主题样式
 * 	@value light 浅色
 * 	@value dark 深色
 * 	@default light
 */

export default {
	name: 'CoAlert',
	components: {
		CoSvgIcon,
	},
	props: {
		title: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: 'info'
		},
		color: {
			type: String,
			default: ''
		},
		backgroundColor: {
			type: String,
			default: ''
		},
		customStyle: {
			type: String,
			default: ''
		},
		showIcon: {
			type: Boolean,
			default: true
		},
		icon: {
			type: String,
			default: ''
		},
		iconSize: {
			type: Number,
			default: 18
		},
		iconColor: {
			type: String,
			default: ''
		},
		effect: {
			type: String,
			default: 'light'
		},
	},
	computed: {
		newColor() {
			const colors = {
				success: '#67c23a',
				info: '#1989FA',
				warning: '#e6a23c',
				error: '#f56c6c',
			}

			let defaultColor = ''
			if (this.effect === 'dark') {
				defaultColor = '#fff'
			}
			else {
				defaultColor = colors[this.type]
			}

			return this.color || defaultColor
		},
		newBgColor() {
			const bgColors = {
				light: {
					success: 'rgb(239.8, 248.9, 235.3)',
					info: '#ecf9ff',
					warning: 'rgb(252.5, 245.7, 235.5)',
					error: 'rgb(254, 240.3, 240.3)',
				},
				dark: {
					success: '#67c23a',
					info: '#1989FA',
					warning: '#e6a23c',
					error: '#f56c6c',
				},
			}

			return this.backgroundColor || bgColors[this.effect][this.type]
		},
		newIcon() {
			const icons = {
				success: 'successFilled',
				info: 'infoFilled',
				warning: 'warningFilled',
				error: 'failFilled',
			}

			return this.icon || icons[this.type]
		},
		newIconColor() {
			return this.iconColor || this.newColor
		},
		alertStyle() {
			let style = `
				color: ${this.newColor};
				background-color: ${this.newBgColor};
				${this.customStyle}
			`

			return style.replace(/\s+/g, ' ')
		},
	}
}
</script>

<style lang="scss" scoped>
.co-alert {
	display: flex;
	align-items: flex-start;
	padding: 16rpx 24rpx;
	font-size: 28rpx;
	color: #1989FA;
	background-color: #ECF9FF;

	&__main {
		padding-left: 12rpx;
	}
}
</style>
