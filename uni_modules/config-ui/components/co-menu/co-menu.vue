<template>
  <view ref="listRef" class="menu" @click="hideMenu" @touchmove="handleTouchMove">
    <slot name="content"></slot>
    <view id="menuWrapper" class="menu__wrapper" :style="wrapperStyle">
      <view class="menu-list" :style="listStyle" @transitionend="handleTransitionEnd">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * Menu
 * @description 菜单组件
 * @event click 点击菜单项时触发，返回参数为菜单项的索引
 */

export default {
  name: 'CoMenu',
  data() {
    return {
      listStyle: 'opacity: 0;',
      wrapperStyle: 'top: -1000px; left: -1000px;',
      menuHeight: 0, // 菜单的高度
      menuWidth: 0, // 菜单的宽度
      windowHeight: 0, // 可视区域的高度
      windowHeight: 0, // 可视区域的高度
      touchStartTime: 0, // 用于记录触摸开始的时间
      longPressThreshold: 500, // 长按阈值
      isSliding: false, // 用于标记是否发生了滑动
    }
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this)
    query.select('#menuWrapper').boundingClientRect()
    query.exec((data) => {
      if (!data[0]) return

      // console.log('得到布局位置信息' + JSON.stringify(data))
      const height = parseInt(data[0].height)
      const width = parseInt(data[0].width)
      this.menuHeight = height
      this.menuWidth = width
    })

    const systemInfo = uni.getSystemInfoSync()
    this.windowHeight = systemInfo.windowHeight
    this.windowWidth = systemInfo.windowWidth
  },
  methods: {
    showMenu(e) {
      let y = 0
      if (this.menuHeight + e.touches[0].clientY > this.windowHeight) {
        y = this.windowHeight - this.menuHeight
      }
      else {
        y = e.touches[0].clientY
      }

      let x = 0
      if (this.menuWidth + e.touches[0].clientX > this.windowWidth) {
        x = this.windowWidth - this.menuWidth
      }
      else {
        x = e.touches[0].clientX
      }

      this.wrapperStyle = `left: ${x}px; top: ${y}px;`
      this.listStyle = 'opacity: 1;'
    },
    hideMenu() {
      this.listStyle = this.$options.data().listStyle
    },
    handleMenuItemClick(index) {
      this.$emit('click', index)
      this.hideMenu()
    },
    handleTransitionEnd() {
      const initData = this.$options.data()

      if (this.listStyle === initData.listStyle) {
        this.wrapperStyle = this.$options.data().wrapperStyle
      }
    },
    handleTouchMove() {
      this.hideMenu()
    },
  },
}
</script>

<style lang="scss" scoped>
.menu {
  .menu__wrapper {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2024;

    .menu-list {
      width: max-content;
      padding: 0 20rpx;
      color: #fff;
      font-size: 32rpx;
      background: rgba(0, 0, 0, 0.85);
      border-radius: 20rpx;
      box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(51,51,51,0.2);
      opacity: 0;
      transition: opacity 0.3s;
    }
  }
}
</style>
