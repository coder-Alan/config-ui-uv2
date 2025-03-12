<template>
  <view class="co-icon-bar" @click="handleClick">
    <view class="bar-left co-flex-center">
      <view v-if="thumbnail" class="thumbnail">
        <image class="img" :src="thumbnail" mode="aspectFit"></image>
      </view>
      <template v-if="$slots.default">
				<slot></slot>
      </template>
      <view v-else class="name">{{ title }}</view>
    </view>
    <view class="bar-right">
      <CoSvgIcon
				icon="arrowRight"
				size="22"
				color="#ccc"
			></CoSvgIcon>
    </view>
  </view>
</template>

<script>
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

/**
 * IconBar 图标栏
 * @description 图标栏组件
 * @property {String} thumbnail 左侧缩略图
 * @property  {String} title 左侧标题
 * @property  {String} icon 右侧图标
 * @event {Function} click 点击事件
 */

export default {
  name: 'CoIconBar',
  components: {
    CoSvgIcon,
  },
  props: {
    thumbnail: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'arrowRight'
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
  }
}
</script>

<style lang="scss" scoped>
.co-icon-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96rpx;
  padding: 0 30rpx;
  margin-bottom: 10rpx;
  color: #333333;
  font-size: 34rpx;
  background-color: #FFFFFF;
  border-top: 1rpx solid #EEEEEE;
  border-bottom: 1rpx solid #EEEEEE;

  .bar-left {
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;

    .thumbnail {
      width: 48rpx;
      height: 48rpx;
    
      .img {
        width: 100%;
        height: 100%;
      }
    }

    .name {
      padding-left: 30rpx;
    }
  }
}
</style>
