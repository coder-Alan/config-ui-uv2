<template>
	<view class="co-upload-status-box">
		<!-- 图片的上传状态 -->
		<view v-if="type === 'image'" class="co-upload-status-box__image-content">
			<template v-if="status !== 'rejected'">
				<progress
					active-color="#1989fa"
					border-radius="10"
					stroke-width="8"
					class="co-upload-status-box__image-content__progress"
					:percent="percent"
				></progress>
				<div class="co-upload-status-box__tip">正在上传中</div>
			</template>
			<template v-else>
				<div class="co-upload-status-box__tip">上传失败！</div>
			</template>
		</view>
		<!-- 文件的上传状态 -->
		<view v-if="type === 'file'" class="co-upload-status-box__file-content">
			<template v-if="status !== 'rejected'">
				<progress
					active-color="#1989fa"
					border-radius="10"
					class="co-upload-status-box__file-content__progress"
					:percent="percent"
				></progress>
				<div class="co-upload-status-box__tip">正在上传中...</div>
			</template>
			<template v-else>
				<div class="co-upload-status-box__tip file_error">上传失败！</div>
			</template>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CoUploadStatusBox',
	props: {
		// 上传状态（pending：上传中；uploaded：上传完成，进度条隐藏；fulfilled：已上传，完成的最终状态；rejected：上传失败）
		status: {
			type: String,
			required: true,
			default: 'pending'
		},
		// 上传类型（image：图片，file：文件）
		type: {
			type: String,
			default: 'image'
		}
	},
	data() {
		return {
			timer: null,
			percent: 0
		}
	},
	watch: {
		status: {
			handler(val) {
				if (val === 'pending') {
					this.timer = setInterval(() => {
						if (this.percent >= 95) {
							this.timer && clearInterval(this.timer)
						}
						else if (this.percent >= 80) {
							this.percent = Number((this.percent + 0.1).toFixed(1))
						}
						else {
							this.percent += 1
						}
					}, 100)
				}
				else if (val === 'uploaded') {
					this.timer && clearInterval(this.timer)
					this.timer = setInterval(() => {
						if (this.percent >= 100) {
							this.timer && clearInterval(this.timer)
							this.$emit('change')
						}
						else {
							this.percent += 3
						}
					}, 10)
				}
			},
			immediate: true
		}
	},
	beforeDestroy() {
		this.timer && clearInterval(this.timer)
	}
}
</script>

<style lang="scss" scoped>
.co-upload-status-box {
	width: 100%;

	&__tip {
		color: #ccc;
		font-size: 10px;
	}

	&__image-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 160rpx;
		padding: 0 10rpx;
		background-color: #F5F5F5;
		color: #999999;
		font-size: 40rpx;
		box-sizing: border-box;

		&__progress {
			width: 100%;
		}
		
		.co-upload-status-box__tip {
			padding-top: 10rpx;
		}
	}

	&__file-content {
		display: flex;
		flex-direction: column;
		padding-right: 24rpx;
		box-sizing: border-box;

		&__progress {
			flex: 1;
			overflow: hidden;
		}

		.co-upload-status-box__tip {
			// position: relative;
			// top: 4rpx;
      padding-top: 10rpx;
		}

		.file_error {
			padding-left: 0;
			color: $uni-color-error;
		}
	}
}
</style>
