<template>
  <view class="alert-page">
    <view class="title">基础用法</view>
    <co-alert title="提示"></co-alert>
    <view style="height: 12px;"></view>
    <co-alert type="success" title="成功"></co-alert>
    <view style="height: 12px;"></view>
    <co-alert type="warning" title="警告"></co-alert>
    <view style="height: 12px;"></view>
    <co-alert type="error" title="错误"></co-alert>

    <view class="title">主题</view>
    <co-alert effect="dark" title="提示"></co-alert>
    <view style="height: 12px;"></view>
    <co-alert type="success" effect="dark" title="成功"></co-alert>
    <view style="height: 12px;"></view>
    <co-alert type="warning" effect="dark" title="警告"></co-alert>
    <view style="height: 12px;"></view>
    <co-alert type="error" effect="dark" title="错误"></co-alert>

    <view class="title">自定义图标</view>
    <co-alert icon="questionFilled" title="问题"></co-alert>

    <view class="title">自定义样式</view>
    <co-alert title="文字信息" background-color="rgb(243.9, 244.2, 244.8)" color="#909399"></co-alert>

    <view class="title">不显示图标</view>
    <co-alert title="提示" :show-icon="false"></co-alert>
    <view style="height: 12px;"></view>
    <co-alert type="success" title="成功" :show-icon="false"></co-alert>
    <view style="height: 12px;"></view>
    <co-alert type="warning" title="警告" :show-icon="false"></co-alert>
    <view style="height: 12px;"></view>
    <co-alert type="error" title="错误" :show-icon="false"></co-alert>

  </view>
</template>

<script>
</script>

<style lang="scss" scoped>
.alert-page {
  padding-bottom: 50px;
}
</style>
