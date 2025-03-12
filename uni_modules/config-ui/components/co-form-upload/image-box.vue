<template>
	<view class="co-upload-image-box" @click="previewEvent">
		<image class="image" :src="src" mode="scaleToFill"></image>
		<view v-if="loading" class="co-upload-image-box__loading">
			<view class="co-loading-circle loading"></view>
		</view>
	</view>
</template>

<script>
import { getFileUrl } from '../../utils/file-handler'

export default {
	name: 'CoUploadImageBox',
	props: {
		url: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			src: '',
			loading: false
		}
	},
	watch: {
		url: {
			handler(val) {
				if (!val) return
				if (val.indexOf('http') !== -1 || val.indexOf('wxfile') !== -1) {
					this.src = val
				}
				else {
					this.src = getFileUrl(val)
				}
			},
			immediate: true
		}
	},
	methods: {
		previewEvent() {
			this.$emit('preview')
		}
	}
}
</script>

<style lang="scss" scoped>
.co-upload-image-box {
	position: relative;
	width: 100%;
	height: 160rpx;
	background-color: #F5F5F5;

	&__loading {
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background: rgba(#000, 0.3);
	}

	.image {
		width: 100%;
		height: 100%;
	}

	.loading {
		margin-left: unset;
	}
}
</style>
