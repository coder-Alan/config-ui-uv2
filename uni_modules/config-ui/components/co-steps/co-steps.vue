<template>
  <view class="co-steps">
    <slot></slot>
  </view>
</template>

<script>
/**
 * Steps
 * @description 步骤流程，用于展示一个流程的进度，可自定义样式
 * @property {Number} active 设置当前激活步骤
 * @property {String} process-status = [wait|process|warning|error|success] 设置当前步骤的状态
 *  @value wait 未完成
 *  @value process 进行中
 *  @value warning 警告
 *  @value error 错误
 *  @value success 成功
 *  @default wait
 */

export default {
	name: 'CoSteps',
  props: {
    active: {
      type: Number,
      default: -1
    },
    processStatus: {
      type: String,
      default: 'wait'
    },
  },
  mounted() {
    let showLine = false

    if (this.$children.length > 1) {
      showLine = true
      this.$children[0].setFirstStep()
      this.$children[this.$children.length - 1].setLastStep()
    }

    this.$children.forEach((item, index, list) => {
      if (index < this.active) {
        item.setStatus('success')
      }
      else if (index === this.active) {
        item.setStatus(this.processStatus)
      }
    })

    this.$children.forEach((item, index, list) => {
      if (list[index - 1] && item.newStatus !== 'wait') {
        item.setPreviousStepLine(list[index - 1].newStatus)
      }
      if (list[index + 1] && list[index + 1].newStatus !== 'wait') {
        item.setCurrentStepLine()
      }
    })
  },
}
</script>
