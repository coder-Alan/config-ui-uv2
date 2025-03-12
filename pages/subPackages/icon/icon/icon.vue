<template>
  <view class="icon-page">
    <view v-for="item in iconList" :key="item" class="icon-item" @click="setClipboard(item)">
      <co-svg-icon :icon="item" size="20"></co-svg-icon>
      <view class="co-padding-top-12">{{ item }}</view>
    </view>
  </view>
</template>

<script>
import icons from '@/uni_modules/config-ui/static/svg'

export default {
  data() {
    return {
      iconList: []
    }
  },
  onLoad() {
    for (const key in icons) {
      this.iconList.push(key)
    }
  },
  methods: {
    setClipboard(e) {
      uni.setClipboardData({
        data: e,
        success: function () {
          uni.showToast({
            title: '复制成功',
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-page {
  display: flex;
  flex-wrap: wrap;

  .icon-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 25%;
    height: 80px;
    font-size: 24rpx;
    color: #999;
    border-right: 1rpx solid #ccc;
    border-bottom: 1rpx solid #ccc;
    box-sizing: border-box;
  }

  .icon-item:nth-child(4n) {
    border-right: none;
  }
}
</style>
