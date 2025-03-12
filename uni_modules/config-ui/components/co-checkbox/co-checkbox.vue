<template>
  <view
    class="co-checkbox"
    :class="{ 'is-indeterminate': indeterminate, 'is-checked': isChecked, 'is-disabled': disabled }"
    :style="boxStyle"
    @click="change"
  >
    <view class="co-checkbox__inner"></view>
    <view v-if="label" class="co-checkbox__label">{{ label }}</view>
  </view>
</template>

<script>
/**
 * CoCheckbox 复选框
 * @property {String|Number|Boolean|Object} v-model 绑定值
 * @property {String|Number|Boolean} label 复选框文本
 * @property {String|Number} size 复选框大小
 * @property {String|Number} labelSize 复选框文本大小
 * @property {Boolean} checked 当前是否勾选
 * @property {Boolean} indeterminate 设置不确定状态，仅负责样式控制
 * @property {Boolean} disabled 是否禁用
 * @event {Function} change 选中状态改变时触发
 */

export default {
  name: 'CoCheckbox',
  props: {
    value: {
      type: [String, Number, Boolean, Object],
      default: ''
    },
    label: {
      type: [String, Number, Boolean],
      default: ''
    },
    size: {
      type: [String, Number],
      default: '19px'
    },
    labelSize: {
      type: [String, Number],
      default: '14px'
    },
    checked: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isChecked: false
    }
  },
  computed: {
    boxStyle() {
      const styleObj = {
        '--co-checkbox-size': typeof this.size === 'number' ? this.size + 'px' : this.size,
        '--co-checkbox-label-size': typeof this.labelSize === 'number' ? this.labelSize + 'px' : this.labelSize
      }
      let styleStr = ''
      for (const key in styleObj) {
        styleStr += `${key}:${styleObj[key]};`
      }
      return styleStr
    }
  },
  watch: {
    checked: {
      handler(val) {
        this.isChecked = val
      },
      immediate: true
    }
  },
  methods: {
    change() {
      this.isChecked = !this.isChecked
      this.$emit('change', this.isChecked ? this.value : undefined)
    }
  }
}
</script>

<style lang="scss" scoped>
.co-checkbox {
  display: inline-flex;
  align-items: center;
  vertical-align: bottom;

  &__inner {
    position: relative;
    width: var(--co-checkbox-size);
    height: var(--co-checkbox-size);
    background-color: #fff;
    border: 1rpx solid #dcdfe6;
    border-radius: 4rpx;
    box-sizing: border-box;
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
  }

  &__label {
    margin-left: 10rpx;
    font-size: var(--co-checkbox-label-size);
  }
}

.is-indeterminate {
  .co-checkbox__inner {
    background-color: #409eff;
    border: 1rpx solid #409eff;

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: block;
      background-color: #fff;
      height: 2rpx;
      width: 50%;
    }
  }
}

.is-checked {
  .co-checkbox__inner {
    background-color: #409eff;
    border: 1rpx solid #409eff;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      display: block;
      height: 14rpx;
      width: 6rpx;
      border: 1rpx solid #fff;
      border-left: 0;
      border-top: 0;
      box-sizing: content-box;
    }
  }
}

.is-disabled {
  .co-checkbox__inner {
    background-color: #f5f7fa;
    border: 1rpx solid #dcdfe6;
  }

  .co-checkbox__label {
    color: #a8abb2;
  }
}
</style>
