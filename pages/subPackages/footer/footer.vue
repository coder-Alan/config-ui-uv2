<template>
  <view class="co-default-page">
    <co-footer
      :fixed="false"
      :shadow="false"
      :options="[{type: 'primary', text: '确定', disabled: false}]"
    ></co-footer>

    <view style="padding-top: 20px;"></view>
    <co-footer
      :fixed="false"
      :shadow="false"
      :options="options"
      @cancel="onCancel"
      @confirm="onConfirm"
    ></co-footer>

    <view style="padding-top: 20px;"></view>
    <co-footer :fixed="false">
      <view>自定义内容</view>
    </co-footer>

    <view style="padding-top: 20px;"></view>
    <co-footer @click="onClick"></co-footer>
  </view>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          type: 'info',
          text: '取消',
          disabled: false,
          methodName: 'cancel',
        },
        {
          type: 'primary',
          text: '确定',
          disabled: false,
          methodName: 'confirm',
        }
      ]
    }
  },
  methods: {
    onCancel() {
      console.log('取消')
    },
    onConfirm() {
      console.log('确定')
    },
    onClick() {
      console.log('点击')
    }
  }
}
</script>
