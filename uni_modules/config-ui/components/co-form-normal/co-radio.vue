<template>
	<radio-group class="co-radio-group" :class="groupClass" @change="onChange">
		<label v-for="item in config.radioList" :key="item.value" class="co-radio-group__item">
			<radio
				color="#1677FF"
				class="co-radio-group__item__radio"
				:value="item.value"
				:checked="item.value === value"
				:disabled="config.disabled"
			></radio>
			<view>{{ item.label }}</view>
		</label>
	</radio-group>
</template>

<script>
export default {
	name: 'CoRadio',
	props: {
		value: {
			type: [String, Number, Boolean],
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
		groupClass() {
			return `co-radio-group__${this.config.layout}`
		}
	},
	methods: {
		onChange({ detail: { value } }) {
			this.$emit('input', value)
		}
	}
}
</script>

<style lang="scss" scoped>
.co-radio-group {
	display: flex;
	justify-content: flex-end;
	flex-wrap: wrap;

	&__item {
		display: flex;

		&__radio {
			transform: scale(0.8);
		}
	}
}

.co-radio-group__horizontal {
	justify-content: flex-end;

	.co-radio-group__item + .co-radio-group__item {
		margin-left: 24rpx;
		margin-bottom: 6rpx;
	}
}

.co-radio-group__vertical {
	justify-content: flex-start;
	
	.co-radio-group__item {
		margin: 0 32rpx 6rpx 0;
	}
}
</style>
