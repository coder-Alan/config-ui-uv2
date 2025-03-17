<template>
	<view class="co-arrow" :class="arrowClass" @click="onClick">
		<view v-if="loading" class="co-loading-circle"></view>
		<view
			v-if="value"
			class="arrow-text"
			:style="{ color: config.valueColor }"
			:class="{ 'co-singe-ellipsis': config.ellipsis }"
		>
			{{ value }}
		</view>
		<template v-if="!config.disabled">
			<view
				v-if="config.showTip && !value && !loading"
				class="arrow-text"
				:style="{ color: config.placeholderColor }"
			>
				{{ config.placeholder || '请选择' }}
			</view>
			<CoSvgIcon
				v-if="!config.clear || !value"
				icon="arrowRight"
				size="18"
				color="#c0c4cc"
				class="arrow-icon"
			></CoSvgIcon>
		</template>
		<CoSvgIcon
			v-if="!config.disabled && value && config.clear"
			icon="circleClose"
			size="18"
			color="#c0c4cc"
			class="arrow-icon"
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
		loading: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		arrowClass() {
			return this.config.layout ? `is-${this.config.layout}` : ''
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
@import '../../styles/loading.scss';

.co-arrow {
	display: flex;
	align-items: center;

	.arrow-text {
		word-break: break-all;
	}

	.arrow-icon {
		padding-left: 6rpx;
	}
}

.is-horizontal {
	justify-content: flex-end;

	.arrow-text {
		padding-left: 12rpx;
	}
}

.is-vertical {
	justify-content: space-between;
}
</style>
