<template>
	<view v-if="show" class="co-footer">
		<view v-if="fixed" class="co-footer__padding" :style="heightStyle"></view>
		<view class="co-footer__buttons" :style="contentStyle">
			<template v-if="$slots.default">
				<slot></slot>
			</template>
			<template v-else>
				<CoButton
					v-for="(item, index) in options"
					:key="index"
					class="foot-button"
					:type="item.type"
					:disabled="item.disabled"
					:plain="item.plain"
					style="height: 100%;width: 100%;"
					@click="onClick(item)"
				>
					{{ item.text }}
				</CoButton>
			</template>
		</view>
	</view>
</template>

<script>
import CoButton from '../co-button/co-button.vue';

/**
 * Footer
 * @description 底部操作栏
 * @property {Array} options 底部操作栏的按钮配置
 * 	@field {String} options.type = [primary|success|info|warning|danger] 按钮类型
 * 		@value primary 主要按钮
 * 		@value success 成功按钮
 * 		@value info 信息按钮
 * 		@value warning 警告按钮
 * 		@value danger 危险按钮
 * @property {Boolean} fixed 是否固定在底部
 * 	@default true
 * @property {Boolean} shadow 是否显示阴影
 * 	@default true
 * @event * 自定义事件名 点击按钮时触发
 */

export default {
	name: 'CoFooter',
	components: {
		CoButton,
	},
	props: {
		options: {
			type: [Array, null],
			default: () => ([
				{
					type: 'primary', // primary、warn、warning、info
          text: '提交',
					plain: false,
          disabled: false,
          methodName: 'click',
				}
			])
		},
		fixed: {
			type: Boolean,
			default: true
		},
		shadow: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			height: 0,
		}
	},
	computed: {
		show() {
			return this.options.length > 0 || this.$slots.default
		},
		heightStyle() {
			return this.height ? `height: ${this.height}px;` : ''
		},
		contentStyle() {
			let style = `${this.heightStyle}
				position: ${this.fixed ? 'fixed' : 'unset'};
				box-shadow: ${this.shadow ? '0px 0px 12px rgba(0, 0, 0, .12)' : 'none'};
			`

			return style.replace(/\s+/g, ' ')
		}
	},
	mounted() {
		const observer = uni.createIntersectionObserver(this)
		observer
			.relativeToViewport()
			.observe('.co-footer__buttons', (res) => {
				if (res.intersectionRatio > 0) {
					uni.createSelectorQuery()
						.in(this)
						.selectAll('.co-footer__buttons')
						.boundingClientRect((data) => {
							let height = data[0].height
							if (height < 65) {
								height = 65
							}
							this.height = height
						})
						.exec();

					observer.disconnect()
				}
			})
	},
	methods: {
		onClick(item) {
			if (!item.methodName) return

			this.$emit(item.methodName)
		}
	}
}
</script>

<style lang="scss" scoped>
.co-footer {
	&__padding {
		width: 100%;
	}

	&__buttons {
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 24rpx;
		background-color: #FFFFFF;
		box-sizing: border-box;
		z-index: 10;

		.foot-button {
			flex: 1;
			height: 100%;
		}
	}
}
</style>
