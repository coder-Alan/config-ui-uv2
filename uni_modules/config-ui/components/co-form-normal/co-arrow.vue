<template>
	<view class="co-arrow" :class="arrowClass" @click="onClick">
		<view
			v-if="value"
			class="co-arrow__value-break"
			:style="{ color: config.valueColor }"
			:class="{ 'co-singe-ellipsis': config.ellipsis }"
		>{{ value }}</view>
		<template v-if="!config.disabled">
			<view
				v-if="config.showTip && !value"
				class="co-arrow__value-break"
				:style="{ color: config.placeholderColor }"
			>{{ config.placeholder || '请选择' }}</view>
			<CoSvgIcon
				v-if="!config.clear || !value"
				icon="arrowRight"
				size="18"
				color="#c0c4cc"
				class="co-arrow__icon"
			></CoSvgIcon>
		</template>
		<CoSvgIcon
			v-if="!config.disabled && value && config.clear"
			icon="circleClose"
			size="18"
			color="#c0c4cc"
			class="co-arrow__icon"
			@click="$emit('clear')"
		></CoSvgIcon>
	</view>
</template>

<script>
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

export default {
	name: 'CoArrow',
	components: {
		CoSvgIcon,
	},
	props: {
		value: {
			type: [String, Number],
			default: ''
		},
		config: {
			type: Object,
			default: () => ({})
		},
	},
	computed: {
		arrowClass() {
			return this.config.layout ? `co-arrow__${this.config.layout}` : ''
		}
	},
	methods: {
		onClick() {
			if (this.config.disabled) return

			this.$emit('click', this.config.methodName)
		}
	},
}
</script>

<style lang="scss" scoped>
.co-arrow {
	display: flex;
	align-items: center;

	&__value-break {
		word-break: break-all;
	}

	&__horizontal {
		justify-content: flex-end;
	}

	&__vertical {
		justify-content: space-between;
	}

	&__icon {
		padding-left: 6rpx;
	}
}
</style>
