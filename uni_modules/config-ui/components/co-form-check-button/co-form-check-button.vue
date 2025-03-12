<template>
	<view class="co-form-check-button" :class="barClass" :style="config.customStyle">
		<CoFormLabel :config="config" @iconClick="onClick"></CoFormLabel>
		<view class="check-button-list">
			<view
				v-for="item in config.list"
				:key="item[valueKey]"
				:class="[item[valueKey] === modelValue ? `co-form-check-button__${config.type}` : '']"
				class="check-button"
				@click="change(item)"
			>
				{{ item[config.labelKey] }}
			</view>
		</view>
	</view>
</template>

<script>
import CoFormLabel from '../co-form-label/co-form-label'

/**
 * FormCheckButton
 * @description 表单复选按钮，form组件的内置组件
 * @property {String|Number|Boolean|Object} v-model 绑定的值
 * @property {Object} attrs 组件属性配置
 * 	@field {String} type = [primary|warning|danger] 按钮类型
 * 		@value primary 主要按钮
 * 		@value warning 警告按钮
 * 		@value danger 危险按钮
 * 		@default primary
 * 	@field {Array} list 数据列表
 * 	@field {String} labelKey 标签字段名
 * 	@field {String} valueKey 值字段名
 * 	@field {String} customStyle 自定义样式
 * 	@field {Boolean} disabled 是否禁用
 * 	@field ... CoFormLabel 组件的属性
 * @event * 自定义事件名 当点击 CoFormLabel 组件的图标触发
 */

export default {
	name: 'CoFormCheckButton',
	components: {
		CoFormLabel,
	},
	props: {
		value: {
			type: [String, Number, Boolean, Object],
			required: false,
			default: ''
		},
		attrs: {
			type: Object,
			required: false,
			default: () => ({})
		}
	},
	computed: {
		modelValue: {
			get() {
				if (Reflect.toString.call(this.value) === '[object Object]') {
					return this.value[this.config.valueKey]
				}
				else {
					return this.value
				}
			},
			set(val) {
				this.$emit('input', val)
			}
		},
		config() {
			const defaultAttrs = {
				type: 'primary',
				label: '',
				list: [
					{ label: '是', value: 'Y' },
					{ label: '否', value: 'N' }
				],
				labelKey: 'label',
				valueKey: 'value',
				borderAlign: 'bottom',
				labelSize: '32rpx',
				labelColor: '#999',
				labelStyle: '',
				labelIcon: '',
				labelIconStyle: '',
				layout: 'horizontal',
				customStyle: '',
				disabled: false,
			}
			return Object.assign(defaultAttrs, this.attrs)
		},
		valueKey() {
			return this.config.valueKey
		},
		barClass() {
			return [
				this.config.borderAlign ? `co-border-${this.config.borderAlign}` : '',
				this.config.layout ? `co-form-check-button__${this.config.layout}` : '',
			]
		}
	},
	methods: {
		change(item) {
			if (this.config.disabled) return

			if (this.modelValue === item[this.valueKey]) {
				this.modelValue = ''
			}
			else {
				this.modelValue = item[this.valueKey]
			}
		},
		onClick(e) {
			this.$emit('click', e, this.attrs)
		}
	}
}
</script>

<style lang="scss" scoped>
@mixin before() {
	content: '✓';
	position: absolute;
	right: 6rpx;
	bottom: 0;
	color: #FFFFFF;
	font-size: 16rpx;
	z-index: 2;
}

@mixin after($color) {
	content: '';
	position: absolute;
	bottom: 0;
	right: -40rpx;
	border-width: 0 40rpx 34rpx;
	border-style: solid;
	border-color: transparent transparent $color;
	z-index: 1;
}

.co-form-check-button {
	display: flex;
	align-items: center;
	padding: 24rpx 24rpx 24rpx 32rpx;
	background-color: #FFFFFF;

	.check-button-list {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
		overflow: hidden;

		.check-button {
			position: relative;
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 74rpx;
			font-size: 30rpx;
			color: #333333;
			background-color: #F5F5F5;
			border-radius: 8rpx;
			overflow: hidden;
		}

		.check-button + .check-button {
			margin-left: 24rpx;
		}
	}

	&__primary {
		background-color: #E8F1FF !important;
		color: #336FC2 !important;

		&::before {
			@include before();
		}

		&::after {
			@include after(#336FC2);
		}
	}

	&__danger {
		color: #EE4052 !important;
		background-color: #FFE6E7 !important;

		&::before {
			@include before();
		}

		&::after {
			@include after(#EE4052);
		}
	}

	&__warning {
		color: #FFB04A !important;
		background-color: #FFF4E8 !important;

		&::before {
			@include before();
		}

		&::after {
			@include after(#FFB04A);
		}
	}
}

.co-form-check-button__vertical {
	flex-direction: column;
	align-items: unset;
}
</style>
