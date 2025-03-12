<template>
  <view class="popup-page co-default-page">
    
    <view class="title">基本用法，默认底部弹出</view>
    <view>
      <button type="primary" class="co-button" @click="show1 = !show1">点击弹出</button>
      <co-popup v-model="show1">
        <view class="content"></view>
      </co-popup>
    </view>
    
    <view class="title">顶部弹出</view>
    <view>
      <button type="primary" class="co-button" @click="show2 = !show2">点击弹出</button>
      <co-popup v-model="show2" placement="top">
        <view class="content"></view>
      </co-popup>
    </view>
    
    <view class="title">中间弹出</view>
    <view>
      <button type="primary" class="co-button" @click="show3 = !show3">点击弹出</button>
      <co-popup v-model="show3" placement="center">
        <view class="content"></view>
      </co-popup>
    </view>
    
    <view class="title">圆角</view>
    <view>
      <button type="primary" class="co-button" @click="show4 = !show4">点击弹出</button>
      <co-popup v-model="show4" placement="center" round>
        <view class="content"></view>
      </co-popup>
    </view>
    
    <view class="title">不显示遮罩层，默认显示</view>
    <view>
      <button type="primary" class="co-button" @click="show5 = !show5">点击弹出</button>
      <co-popup v-model="show5" round :modal="false">
        <view class="content"></view>
      </co-popup>
    </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.popup-page {
  .content {
    height: 30vh;
  }
}
</style>
