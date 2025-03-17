<template>
  <view class="co-default-page">
    <co-steps>
      <co-step status="success">
        <template #content>
          <view class="step-item" >
            步骤一
          </view>
        </template>
      </co-step>
      <co-step status="warning">
        <template #content>
          <view class="step-item">
            步骤二
          </view>
          <view class="step-item">
            一些描述
          </view>
        </template>
      </co-step>
      <co-step status="process">
        <template #content>
          <view class="step-item">
            步骤三
          </view>
        </template>
      </co-step>
      <co-step>
        <template #content>
          <view class="step-item">
            步骤四
          </view>
        </template>
      </co-step>
    </co-steps>
    <view style="height: 50px;"></view>
    <co-steps :active="2" process-status="error">
      <co-step>
        <template #content>
          <view class="step-item" >
            步骤一
          </view>
          <view class="step-item">
            一些描述
          </view>
        </template>
      </co-step>
      <co-step>
        <template #content>
          <view class="step-item">
            步骤二
          </view>
          <view class="step-item">
            一些描述
          </view>
        </template>
      </co-step>
      <co-step>
        <template #content>
          <view class="step-item">
            步骤三
          </view>
          <view class="step-item">
            一些描述
          </view>
        </template>
      </co-step>
      <co-step>
        <template #content>
          <view class="step-item">
            步骤四
          </view>
          <view class="step-item">
            一些描述
          </view>
        </template>
      </co-step>
    </co-steps>
  </view>
</template>

<script>
</script>

<style lang="scss" scoped>
.step-item {
  padding: 24rpx;
}
</style>
