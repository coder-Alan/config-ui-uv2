<template>
  <view class="co-menu-item" @click="handleClick">
    <slot></slot>
  </view>
</template>

<script>
/**
 * MenuItem
 * @description 菜单项
 * @property {String|Number} index 唯一标志
 */

export default {
  name: 'CoMenuItem',
  props: {
    // 唯一标志
    index: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    handleClick() {
      this.$parent.handleMenuItemClick(this.index)
    }
  },
}
</script>

<style lang="scss" scoped>
.co-menu-item {
  padding: 20rpx 16rpx;
  text-align: center;
  border-top: 1rpx solid rgba(#EEE, 0.1);
}
</style>
