<template>
  <view v-show="popupShow" class="co-popup">
    <view
      class="co-popup__modal"
      :class="modalClass"
      :style="modalStyle"
      @click.stop="handleClose"
    ></view>
    <view class="co-popup__inner-wrapper" :class="wrapperClass" :style="wrapperStyle">
      <view
        class="co-popup__content"
        :class="contentClass"
        :style="contentStyle"
        @transitionend="onTransitionend"
      >
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>
import ConfigStore from '../../utils/config-store'
import { getCssSize } from '../../utils/index'

/**
 * Popup
 * @description 弹出层容器，用于展示弹窗、信息提示等内容
 * @property {Boolean} v-model 是否显示弹框
 * @property {String} placement = [top|bottom|center] 弹出位置
 *  @value top 顶部
 *  @value bottom 底部
 *  @value center 居中
 *  @default bottom
 * @property {String} position = [fixed|absolute] 定位方式
 *  @value fixed 固定定位
 *  @value absolute 绝对定位
 *  @default fixed
 * @property {String|Number} fixed 弹出距离
 * @property {String|Number} height 显示内容的高度
 * @property {String|Number} width 弹框的宽度，仅居中时有效
 * @property {Boolean} round 是否显示圆角
 * @property {Boolean} modal 是否显示遮罩
 *  @default true
 * @property {Boolean} close-on-click-modal 是否可以通过点击遮罩层关闭
 *  @default true
 * @event open 当弹框打开时触发
 * @event close 当弹框关闭时触发
 * @event opened 当弹框打开后触发
 * @event closed 当弹框关闭后触发
 */

export default {
  name: 'CoPopup',
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    position: {
      type: String,
      default: 'fixed'
    },
    fixed: {
      type: [String, Number],
      default: ''
    },
    height: {
      type: [String, Number],
      default: 'unset'
    },
    width: {
      type: [String, Number],
      default: '80vw'
    },
    round: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      popupShow: false, // 整体的显隐
      contentShow: false, // 内容块的显隐
      zIndex: 10, // z-index 层级
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    modalClass() {
      return [
        this.modal && this.contentShow ? 'co-popup__modal--show' : 'co-popup__modal--hide'
      ]
    },
    modalStyle() {
      return `z-index: ${this.zIndex - 1};`
    },
    wrapperClass() {
      return [
        this.placement ? `co-popup__inner-wrapper--${this.placement}` : '',
      ]
    },
    wrapperStyle() {
      let style = `
        position: ${this.position};
        ${this.fixed ? this.placement + ':' + getCssSize(this.fixed) + ';' : ''}
        z-index: ${this.zIndex};
      `

      return style.replace(/\s+/g, ' ')
    },
    contentClass() {
      return [
        this.contentShow ? 'co-popup__content--show' : `co-popup__content--${this.placement}--hide`,
        this.round ? `co-popup__content--${this.placement}--round` : ''
      ]
    },
    contentStyle() {
      let style = `
        height: ${getCssSize(this.height)};
        width: ${this.placement !== 'center' ? '100vw' : getCssSize(this.width)};
      `

      return style.replace(/\s+/g, ' ')
    },
  },
  watch: {
    show: {
      handler(val) {
        if (val) {
          this.$emit('open')

          // 如果 props 没有设置 zIndex，则自动设置 zIndex，以保证弹窗始终处于最顶层
          ConfigStore.setZIndex(ConfigStore.maxZIndex + 2)
          this.zIndex = ConfigStore.maxZIndex

          this.popupShow = true

          const observer = uni.createIntersectionObserver(this)
          observer
            .relativeToViewport()
            .observe('.co-popup__inner-wrapper', (res) => {
              if (res.intersectionRatio > 0) {
                this.contentShow = true
                observer.disconnect()
              }
            })
        }
        else {
          this.$emit('close')

          this.contentShow = false
        }
      },
      immediate: true
    },
    zIndex(val) {
      this.$emit('zIndexChange', val)
    }
  },
  methods: {
    onTransitionend() {
      if (this.show) {
        this.showEnd = true

        this.$emit('opened')
      }
      else {
        this.popupShow = false

        ConfigStore.setZIndex(ConfigStore.maxZIndex - 2)
        this.zIndex = ConfigStore.maxZIndex

        this.$emit('closed')
      }
    },
    handleClose() {
      if (!this.closeOnClickModal) return
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.co-popup {
  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    // z-index: 10;
    opacity: 0;
    transition: opacity .3s;
  }

  &__modal--show {
    opacity: 1;
  }

  &__modal--hide {
    opacity: 0;
  }

  &__inner-wrapper {
    position: fixed;
    // bottom: 0;
    left: 0;
    height: fit-content;
    overflow: hidden;

    .co-popup__content {
      // height: 80%;
      width: 100vw;
      display: flex;
      flex-direction: column;
      min-height: 50rpx;
      background-color: #FFFFFF;
      // transform: translateY(100%);
      transition: transform .3s, opacity .3s;
      // border-radius: 20rpx 20rpx 0 0;
      overflow: hidden;
      // z-index: 2023;
    }

    .co-popup__content--show {
      // 这里设置 transform 为 none ，是为了避免因 fiexd 导致子弹窗定位异常
      transform: none;
    }

    .co-popup__content--top--round {
      border-radius: 0 0 20rpx 20rpx;
    }

    .co-popup__content--top--hide {
      transform: translateY(-100%);
    }

    .co-popup__content--bottom--round {
      border-radius: 20rpx 20rpx 0 0;
    }

    .co-popup__content--bottom--hide {
      transform: translateY(100%);
    }

    .co-popup__content--center--round {
      border-radius: 20rpx;
    }

    .co-popup__content--center--hide {
      opacity: 0;
    }
  }

  &__inner-wrapper--top {
    top: 0;
  }

  &__inner-wrapper--center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__inner-wrapper--bottom {
    bottom: 0;
  }
}
</style>
