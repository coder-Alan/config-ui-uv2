<template>
  <view class="co-default-page">
    <co-menu ref="menu" @click="handleClick">
      <co-menu-item index="1">选项1</co-menu-item>
      <co-menu-item index="2">选项2</co-menu-item>
      <co-menu-item index="3">
        <co-svg-icon icon="view"></co-svg-icon>
        <text class="co-padding-left-6">选项3</text>
      </co-menu-item>
      <template #content>
        <view class="section1 co-flex-center" @longpress="onLongpress">此区域长按显示菜单</view>
        <view class="section2">此区域长按无效</view>
      </template>
    </co-menu>
  </view>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    handleClick(index) {
      console.log(index)
    },
    onLongpress(e) {
      this.$refs.menu.showMenu(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.section1,
.section2 {
  height: 500px;
}

.section1 {
  color: #fff;
  background-color: #f0ad4e;
}

.section2 {
  text-align: center;
}
</style>
