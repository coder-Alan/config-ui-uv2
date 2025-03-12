<template>
	<view class="co-input">
		<input
			v-model="modelValue"
			class="co-input__main"
			placeholder-style="color: #ccc;"
			:disabled="config.disabled"
			:style="{ color: config.valueColor }"
			:placeholder="config.placeholder || '请输入内容'"
			:type="config.inputType"
			:class="inputClass"
		></input>
		<!-- 单位 -->
		<view class="co-input__unit">
			{{ config.unit }}
		</view>
		<!-- 清空按钮 -->
		<CoSvgIcon
			v-show="showClear"
			class="co-input__clear"
			icon="circleClose"
			color="#c0c4cc"
			size="18"
			@click="$emit('clear')"
		></CoSvgIcon>
		<slot name="append"></slot>
	</view>
</template>

<script>
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

export default {
	name: 'CoInput',
	components: {
		CoSvgIcon,
	},
	props: {
		value: {
			type: [String, Number],
			required: false,
			default: ''
		},
		config: {
			type: Object,
			required: false,
			default: () => ({})
		}
	},
	computed: {
		modelValue: {
			get() {
				return this.value
			},
			set(val) {
				this.$emit('input', val)
			}
		},
		inputClass() {
			return [
				this.config.unit ? 'co-padding-right-12' : ''
			]
		},
		showClear() {
			if (this.config.unit) return false
			return !this.config.disabled && this.modelValue
		}
	}
}
</script>

<style lang="scss" scoped>
.co-input {
	display: flex;
	align-items: center;

	&__main {
		flex: 1;
		overflow: hidden;
	}

	&__clear {
		display: flex;
		padding-left: 12rpx;
	}
}
</style>
