<template>
  <view class="button co-default-page">
    <view class="title">基础用法</view>
    <view class="co-margin-left-12">
      <co-button type="default">default</co-button>
      <co-button type="primary">primary</co-button>
      <co-button type="success">success</co-button>
      <co-button type="info">info</co-button>
    </view>
    <view class="co-margin-top-24 co-margin-left-12">
      <co-button type="warning">warning</co-button>
      <co-button type="danger">danger</co-button>
    </view>
    <view class="co-margin-top-24 co-margin-left-12">
      <co-button type="default" plain>default</co-button>
      <co-button type="primary" plain>primary</co-button>
      <co-button type="success" plain>success</co-button>
      <co-button type="info" plain>info</co-button>
    </view>
    <view class="co-margin-top-24 co-margin-left-12">
      <co-button type="warning" plain>warning</co-button>
      <co-button type="danger" plain>danger</co-button>
    </view>

    <view class="title">禁用状态</view>
    <view class="co-margin-left-12">
      <co-button type="default" disabled>default</co-button>
      <co-button type="primary" disabled>primary</co-button>
      <co-button type="success" disabled>success</co-button>
      <co-button type="info" disabled>info</co-button>
    </view>
    <view class="co-margin-top-24 co-margin-left-12">
      <co-button type="warning" disabled>warning</co-button>
      <co-button type="danger" disabled>danger</co-button>
    </view>
    <view class="co-margin-top-24 co-margin-left-12">
      <co-button type="default" plain disabled>default</co-button>
      <co-button type="primary" plain disabled>primary</co-button>
      <co-button type="success" plain disabled>success</co-button>
      <co-button type="info" plain disabled>info</co-button>
    </view>
    <view class="co-margin-top-24 co-margin-left-12">
      <co-button type="warning" plain disabled>warning</co-button>
      <co-button type="danger" plain disabled>danger</co-button>
    </view>

    <view class="title">图标按钮</view>
    <view class="co-margin-left-12">
      <co-button type="primary" icon="aim"></co-button>
      <co-button type="primary" icon="aim">primary</co-button>
    </view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      themes: ['default', 'primary', 'success', 'info', 'warning', 'danger'],
    }
  },
}
</script>


<style lang="scss" scoped>

</style>
