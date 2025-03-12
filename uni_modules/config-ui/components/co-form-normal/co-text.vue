<template>
	<view class="co-text" @click="onClick">
		<view class="co-text__content" :class="{ 'co-singe-ellipsis': config.ellipsis }" :style="contentStyle">
			<template v-if="!config.slot">
				<view
					v-if="config.placeholder && !value"
					class="co-text__flex-1"
					:style="{ color: config.placeholderColor }"
				>
					{{ config.placeholder }}
				</view>
				<view v-else class="co-text__flex-1">{{ value || value === 0 ? value : '-' }}</view>
			</template>
			<slot v-else></slot>
		</view>
		<!-- 单位 -->
		<view v-if="config.unit" class="co-text__unit">
			{{ config.unit }}
		</view>
	</view>
</template>

<script>
export default {
	name: 'CoText',
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
		contentStyle() {
			let styleStr = `color: ${this.config.valueColor};`
			if (this.config.layout === 'vertical' && !this.config.ellipsis) {
				styleStr += 'flex: unset;'
			}
			return styleStr
		}
	},
	methods: {
		onClick() {
			if (this.config.disabled) return
			this.$emit('click', this.config.methodName)
		}
	}
}
</script>

<style lang="scss" scoped>
.co-text {
	display: flex;
	align-items: flex-end;

	&__content {
		display: flex;
		justify-content: flex-end;
		flex: 1;
		overflow: hidden;
	}

	&__flex-1 {
		flex: 1;
		word-break: break-all;
		overflow: hidden;
	}

	&__unit {
		padding-left: 12rpx;
	}
}
</style>
