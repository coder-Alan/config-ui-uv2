<template>
  <view class="co-default-page">

    <view class="title">基础用法，默认右侧图标</view>
    <co-collapse>
      这是内容
    </co-collapse>

    <view class="title">左侧图标</view>
    <co-collapse icon-position="left">
      这是内容
    </co-collapse>

    <view class="title">默认展开</view>
    <co-collapse open>
      这是内容
    </co-collapse>

    <view class="title">Slot title</view>
    <co-collapse>
      这是内容
      <template #title>
        <view>自定义标题</view>
      </template>
    </co-collapse>

    <view class="title">Slot right</view>
    <co-collapse icon-position="left">
      这是内容
      <template #right>
        <co-svg-icon icon="deleted" size="16" color="#f56c6c"></co-svg-icon>
      </template>
    </co-collapse>

  </view>
</template>

<script>
</script>
