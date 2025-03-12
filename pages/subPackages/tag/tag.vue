<template>
  <view class="co-default-page">
    <view class="title">light</view>
    <view class="co-padding-left-12 co-padding-right-12">
      <co-tag v-for="(item, index) in themes" :key="item" :type="item">标签{{ index + 1 }}</co-tag>
    </view>

    <view class="title">dark</view>
    <view class="co-padding-left-12 co-padding-right-12">
      <co-tag v-for="(item, index) in themes" :key="item" :type="item" effect="dark">标签{{ index + 1 }}</co-tag>
    </view>

    <view class="title">plain</view>
    <view class="co-padding-left-12 co-padding-right-12">
      <co-tag v-for="(item, index) in themes" :key="item" :type="item" effect="plain">标签{{ index + 1 }}</co-tag>
    </view>

    <view class="title">边框描边</view>
    <view class="co-padding-left-12 co-padding-right-12">
      <co-tag v-for="(item, index) in themes" :key="item" :type="item" effect="plain" hit>标签{{ index + 1 }}</co-tag>
    </view>

    <view class="title">标签省略</view>
    <view class="co-flex-center co-padding-left-12 co-padding-right-12">
      <co-tag type="primary" ellipsis style="width: 150rpx;">这是个很长很长的标签</co-tag>
      <co-tag type="primary">标签1</co-tag>
      <co-tag type="primary">标签2</co-tag>
      <co-tag type="primary">标签3</co-tag>
      <co-tag type="primary" class="last-tag" ellipsis>这是个很长很长的标签</co-tag>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      themes: ['primary', 'success', 'info', 'warning', 'danger'],
    }
  },
}
</script>

<style lang="scss" scoped>
.last-tag {
  flex: 1;
  overflow: hidden;
}
</style>
