<template>
	<view class="co-form-normal" :class="barClass" :style="config.customStyle" @click="onClick">
		<CoFormLabel :config="config" @iconClick="onIconClick"></CoFormLabel>
		<!-- input 输入框 -->
		<CoInput
			v-if="config.labelType === 'input'"
			v-model="modelValue"
			:config="config"
			class="co-form-normal-content"
			@clear="onClear"
		>
			<template v-if="config.slot" #[config.slotName]>
				<slot></slot>
			</template>
		</CoInput>
		<!-- 选择箭头 -->
		<Arrow
			v-else-if="config.labelType === 'arrow'"
			:value="modelValue"
			:config="config"
			class="co-form-normal-content"
			@clear="onClear"
		></Arrow>
		<!-- 文本 -->
		<Text
			v-else-if="config.labelType === 'text'"
			:value="modelValue"
			:config="config"
			class="co-form-normal-content"
		>
			<slot v-if="config.slot"></slot>
		</Text>
		<!-- 多行输入框 -->
		<view v-else-if="config.labelType === 'textarea'" class="co-form-normal-content">
			<textarea
				v-model="modelValue"
				:disabled="config.disabled"
				:style="{ color: config.valueColor }"
				:placeholder="config.placeholder || '请输入内容'"
				:maxlength="config.maxlength"
				placeholder-style="color: #ccc;"
				class="co-form-normal-content__textarea"
				@blur="$emit('blur')"
			></textarea>
		</view>
		<!-- radio 单项选择器 -->
		<Radio
			v-else-if="config.labelType === 'radio'"
			v-model="modelValue"
			:config="config"
			class="co-form-normal-content"
		></Radio>
		<slot v-else></slot>
	</view>
</template>

<script>
import CoFormLabel from '../co-form-label/co-form-label'
import CoInput from './co-input'
import CoArrow from './co-arrow'
import CoRadio from './co-radio'
import CoText from './co-text'

/**
 * FormNormal
 * @description 表单普通组件，form组件的内置组件，用于展示普通表单内容
 * @property {String|Number|Boolean} v-model 表单内容
 * @property {Object} attrs 属性配置
 * 	@field {String} labelType = [input|arrow|text|textarea|radio] 标签类型
 * 		@value input 输入框
 * 		@value arrow 选择箭头
 * 		@value text 文本
 * 		@value textarea 多行输入框
 * 		@value radio 单项选择器
 * 	@field {String} valueColor 值的颜色
 * 	@field {String} borderAlign = [top|bottom|vertical] 边框位置
 * 		@value top 上边框
 * 		@value bottom 下边框
 * 		@value vertical 上下边框
 * 		@default bottom
 * 	@field {String} layout = [horizontal|vertical] 标签位置
 * 		@value horizontal 标签在左侧
 * 		@value vertical 标签在上方
 * 		@default horizontal
 * 	@field {Boolean} disabled 是否禁用
 * 	@field {String} placeholder 占位符内容
 * 	@field {String} placeholderColor 占位符颜色
 * 	@field {Array} radioList 单项选择器的选择项列表
 * 	@field {String} customStyle 自定义样式
 * 	@field {String} unit 单位，仅当 labelType 属性为 input/text 时生效
 * 	@field {String} inputType = [text|number|digit|idcard|tel|safe-password|nickname] input框的类型，仅当 labelType 属性为 input/text 时生效
 * 		@value text 文本输入键盘
 * 		@value number 数字输入键盘
 * 		@value digit 带小数点的数字键盘
 * 		@value idcard 身份证输入键盘
 * 		@value tel 电话输入键盘
 * 		@value safe-password 密码安全输入键盘
 * 		@value nickname 昵称输入键盘
 * 		@default text
 * 	@field {Number} maxlength 最大输入长度，设置为 -1 时不限制最大长度，仅当 labelType 属性为 textarea 时生效
 * 	@field {Boolean} showTip 值为空时是否显示提示，仅当 labelType 属性为 arrow 时生效
 * 	@field {Boolean} clear 是否显示清除按钮，仅当 labelType 属性为 arrow 时生效
 * 	@field {String} methodName 点击事件的回调名称，仅当 labelType 属性为 text/arrow 时生效
 * 	@field {Boolean} ellipsis 是否需要单行省略，仅当 labelType 属性为 text/arrow 时生效
 * @event blur 当 textarea 组件失去焦点时触发
 * @event clear 当点击 Input 组件或者 Arrow 组件的清除按钮时触发
 * @event click 当点击 CoFormLabel 组件图标或者点击 labelType 属性为 arrow/text 类型时触发
 */

export default {
	name: 'CoFormNormal',
	components: {
		CoFormLabel,
		CoInput,
		CoArrow,
		CoRadio,
		CoText,
	},
	props: {
		value: {
			type: [String, Number, Boolean],
			default: ''
		},
		attrs: {
			type: [Object, null],
			default: () => ({})
		}
	},
	computed: {
		modelValue: {
			get() {
				if (this.config.disabled &&
				(!this.value && this.value !== 0) &&
				['input', 'arrow', 'text', 'textarea'].includes(this.config.labelType)) {
					return '-'
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
				labelType: '',
				label: '',
				labelSize: '32rpx',
				labelColor: '#999',
				labelStyle: '',
				labelIcon: '',
				labelIconColor: '#ccc',
				labelIconSize: 18,
				labelIconStyle: '',
				iconMethod: '',
				valueColor: '#333',
				borderAlign: 'bottom',
				layout: 'horizontal',
				required: false,
				disabled: false,
				placeholder: '',
				placeholderColor: '#ccc',
				radioList: [
					{ label: '是', value: 'Y' },
					{ label: '否', value: 'N' }
				],
				customStyle: '',
				unit: '',
				inputType: 'text',
				maxlength: -1,
				showTip: true,
				clear: false,
				methodName: '',
				ellipsis: false,
			}
			return Object.assign(defaultAttrs, this.attrs)
		},
		barClass() {
			return [
				`co-form-normal-bar__${this.config.labelType}`,
				`co-form-normal-bar__${this.config.layout}`,
				`co-border-${this.config.borderAlign}`
			]
		}
	},
	methods: {
		validate() {
			if (this.modelValue) {
				return true
			} else {
				return false
			}
		},
		onClear() {
			this.modelValue = ''
			this.$emit('clear', this.attrs)
		},
		onClick() {
			if (!['arrow', 'text'].includes(this.config.labelType)) return
			if (this.config.disabled) return

			this.$emit('click', this.config.methodName, this.attrs)
		},
		onIconClick(e) {
			this.$emit('click', e, this.attrs)
		}
	}
}
</script>

<style lang="scss" scoped>
.co-form-normal {
	display: flex;
	align-items: flex-start;
	padding: 24rpx 24rpx 24rpx 32rpx;
	background-color: #FFFFFF;
	font-size: 32rpx;

	&-content {
		flex: 1;
		overflow: hidden;
		text-align: right;

		&__textarea {
			height: 160rpx;
			width: 100%;
		}
	}
}

// 标签位置
.co-form-normal-bar__vertical {
	flex-direction: column;
	align-items: unset;
	
	.co-form-normal-content {
		padding-top: 14rpx;
		text-align: unset;
	}
}
</style>
