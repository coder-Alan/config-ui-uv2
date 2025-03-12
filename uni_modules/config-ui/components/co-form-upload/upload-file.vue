<template>
	<view class="co-upload-file">
		<view v-for="(item, index) in value" :key="index" class="co-upload-file__item">
			<view class="co-upload-file__item__content">
				<view class="co-upload-file__item__content__file-type">
					<image class="co-upload-file__item__content__file-type__icon" :src="getFileTypeIcon(item.url)" mode="aspectFit"></image>
				</view>
				<view class="co-upload-file__item__content__info">
					<view class="file_name co-singe-ellipsis">
						{{ item.uploadInfo.name || item.uploadInfo.fileName }}
					</view>
					<view v-if="item.status === 'fulfilled'" class="file_size">
						{{ item.uploadInfo.fileSize ? fileSizeFormatter(item.uploadInfo.fileSize) : '-' }}
					</view>
					<StatusBox
						v-if="item.status !== 'fulfilled'"
						:status="item.status"
						type="file"
						@change="$emit('statusChange', index)"
					></StatusBox>
				</view>
				<view class="co-upload-file__item__content__operates">
					<template v-if="item.status !== 'rejected'">
						<view
							class="co-upload-file__item__content__operates__button"
							@click.stop="previewEvent(item.uploadInfo.fileId)"
						>
							<CoSvgIcon
								icon="view"
								size="16"
								color="#1689F5"
							></CoSvgIcon>
							<view class="co-upload-file__item__content__operates__button__text">预览</view>
						</view>
						<view
							class="co-upload-file__item__content__operates__button"
							@click.stop="downloadHandler(item.uploadInfo.fileId)"
						>
							<CoSvgIcon
								icon="download"
								size="16"
								color="#1689F5"
							></CoSvgIcon>
							<view class="co-upload-file__item__content__operates__button__text">下载</view>
						</view>
					</template>
					<!-- 非禁止点击 和 非上传状态 时等待的情况下显示 删除 -->
					<view
						v-if="!config.disabled && item.status !== 'pending'"
						class="co-upload-file__item__content__operates__button co-upload-file__item__content__operates__button-delete"
						@click.stop="$emit('delete', index)"
					>
						<CoSvgIcon
							icon="deleted"
							size="16"
							color="#dd524d"
						></CoSvgIcon>
						<view class="co-upload-file__item__content__operates__button__text">删除</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="value.length < config.max && !config.disabled" class="co-upload-file__item co-upload-file__item-placeholder" @click="$emit('upload')">
			{{ placeholder }}
		</view>
		<view v-if="!value.length && config.disabled" class="co-upload-file__item co-upload-file__tip-null">
			{{ nullTip }}
		</view>
	</view>
</template>

<script>
import StatusBox from './status-box'
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

import {
  fileSizeFormatter,
  downloadHandler,
  downloadToTemp,
  getFileExtension,
} from '../../utils/file-handler'

export default {
	name: 'CoUploadFile',
	components: {
    StatusBox,
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
	computed: {
    uploadTypeName() {
      const names = {
        file: '文件',
        video: '视频'
      }
      return names[this.config.uploadType]
    },
		placeholder() {
			if (this.config.placeholder) {
				return this.config.placeholder
			}
			else {
				return `点击上传${this.uploadTypeName}`
			}
		},
		nullTip() {
			return `无上传${this.uploadTypeName}`
		}
	},
	methods: {
		fileSizeFormatter,
		downloadHandler,
    getFileTypeIcon(url) {
      const extension = getFileExtension(url) || ''
			const map = {
				doc: 'word',
				docx: 'word',
				ppt: 'ppt',
				pptx: 'ppt',
				xls: 'excel',
				xlsx: 'excel',
				pdf: 'pdf',
				txt: 'txt',
				jpg: 'jpg',
				jpeg: 'jpg',
				png: 'png',
				zip: 'zip',
				mp4: 'video'
			}
      const icon = require(`../../static/icons/${map[extension] || 'other'}.js`)
      return icon.default
    },
		previewEvent(fileId) {
			downloadToTemp(fileId)
				.then(res => {
					uni.openDocument({
						filePath: res,
						showMenu: true
					})
				})
		}
	}
}
</script>

<style lang="scss" scoped>
.co-upload-file {
	&__item {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 128rpx;

		&__content {
			position: relative;
			display: flex;
			align-items: center;
			width: 100%;
			height: 100%;
			padding-left: 16rpx;
			background: #f5f5f5;
			border-radius: 10rpx;
			box-sizing: border-box;

			&__file-type {
				width: 60rpx;
				height: 68rpx;

				&__icon {
					width: 100%;
					height: 100%;
				}
			}

			&__info {
				flex: 1;
				padding-left: 12rpx;
				overflow: hidden;

				.file_name {
					color: #333;
					font-size: 30rpx;
				}

				.file_size {
					color: #999;
					font-size: 24rpx;
				}
			}

			&__operates {
				position: absolute;
				bottom: 12rpx;
				right: 20rpx;
				display: flex;
				align-items: center;
				color: #1689F5;

				&__button {
					display: flex;
					align-items: center;
					font-size: 24rpx;

					&__text {
						padding-left: 6rpx;
					}
				}

				&__button-delete {
					color: #dd524d;
				}

				&__button + &__button {
					margin-left: 30rpx;
				}
			}
		}

		&-placeholder {
			height: 108rpx;
			color: #777;
			font-size: 28rpx;
			border: 1rpx dashed #ccc;
			border-radius: 20rpx;
		}
	}

	.co-upload-file__item + .co-upload-file__item {
		margin-top: 20rpx;
	}

	&__tip-null {
		height: unset;
		padding-bottom: 24rpx;
		color: #999;
		font-size: 28rpx;
	}
}
</style>
