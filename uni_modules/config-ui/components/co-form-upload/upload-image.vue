<template>
	<view class="co-upload-image">
		<view v-for="(item, index) in value" :key="index" class="co-upload-image__item justify-center">
			<StatusBox
				v-if="item.status !== 'fulfilled'"
				:status="item.status"
				class="status-box"
				type="image"
				@change="$emit('statusChange', index)"
			></StatusBox>
			<ImageBox
				v-else
				ref="image"
				class="status-box"
				:url="item.url"
				@preview="onPreview(index)"
			></ImageBox>
			<CoSvgIcon
				v-if="!config.disabled && item.status !== 'pending'"
				icon="close"
				size="10"
				color="#333"
				class="delete_button"
				@click="$emit('delete', index)"
			></CoSvgIcon>
		</view>
		<view v-if="value.length < config.max && !config.disabled" class="co-upload-image__item co-justify-center">
			<view class="add_box co-flex-center" @click="$emit('upload')">+</view>
		</view>
		<view v-if="!value.length && config.disabled" class="co-upload-image__tip-null">
			无上传图片
		</view>
	</view>
</template>

<script>
import StatusBox from './status-box'
import ImageBox from './image-box'
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

export default {
	name: 'CoUploadImage',
	components: {
    StatusBox,
    ImageBox,
    CoSvgIcon,
  },
	props: {
		value: {
			type: [Array, String],
			required: false,
			default: () => ([])
		},
		config: {
			type: Object | null,
			required: false,
			default: () => ({})
		}
	},
	methods: {
		onPreview(index) {
			const imageRefs = this.$refs.image
			const urls = imageRefs.map(item => item.src)
			uni.previewImage({
				urls,
				current: urls[index]
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.co-upload-image {
	display: flex;
	flex-wrap: wrap;

	&__item {
		position: relative;
		width: 25%;
		padding: 10rpx;
		box-sizing: border-box;

		.status-box {
			display: flex;
			width: 100%;
			border: 1rpx solid #eee;
		}

		.delete_button {
			position: absolute;
			top: 12rpx;
			right: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 36rpx;
			height: 36rpx;
			transform: translate(50%, -50%);
			background-color: #999;
			border: 1px solid rgba(0, 0, 0, 0.9);
			border-radius: 50%;
			box-sizing: border-box;
		}

		.add_box {
			width: 100%;
			height: 160rpx;
			color: #999999;
			font-size: 40rpx;
			background-color: #F5F5F5;
			border: 1rpx solid #eee;
		}
	}

	&__tip-null {
		width: 100%;
		padding-bottom: 24rpx;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}
}
</style>
