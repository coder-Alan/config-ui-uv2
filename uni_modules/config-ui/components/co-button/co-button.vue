<template>
  <button class="co-button" :type="type" :plain="plain" :disabled="disabled" :style="style" @click="$emit('click')">
    <CoSvgIcon
      v-if="icon"
      :class="$slots.default ? 'co-button-icon' : ''"
      :icon="icon"
      :color="iconColor"
      :size="iconSize"
    ></CoSvgIcon>
    <slot></slot>
  </button>
</template>

<script>
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

/**
 * Button
 * @description 按钮
 * @property {String} type = [default|primary|success|info|warning|danger] 按钮类型
 *  @value default 默认按钮
 *  @value primary 主要按钮
 *  @value success 成功按钮
 *  @value info 信息按钮
 *  @value warning 警告按钮
 *  @value danger 危险按钮
 *  @default default
 * @property {Boolean} plain 是否为朴素按钮
 * @property {Boolean} disabled 是否禁用按钮
 * @property {String} icon 图标名称
 * @property {String} style 自定义样式
 * @event click 点击事件
 */

export default {
  name: 'CoButton',
  components: {
    CoSvgIcon,
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    plain: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    style: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      iconColor: '#fff',
      iconSize: '32rpx',
    }
  },
  watch: {
    disabled: {
      handler() {
        uni.createSelectorQuery().in(this).select(".co-button")
          .fields(
            {
              computedStyle: ['color'],
            },
            (res) => {
              this.iconColor = res.color
            }
          )
          .exec()
      },
      immediate: true
    },
    style: {
      handler() {
        uni.createSelectorQuery().in(this).select(".co-button")
          .fields(
            {
              computedStyle: ['font-size'],
            },
            (res) => {
              this.iconSize = res['font-size']
            }
          )
          .exec()
      },
      immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.co-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  line-height: 1;
  padding: 8px 15px;
  font-size: 32rpx;
  color: #606266;
  background: #fff;
  outline: none;
  overflow: hidden;

  &::after {
    border: none;
  }

  .co-button-icon {
    margin-right: 8rpx;
  }
}

.co-button[type=default] {
  color: #606266;
  background: #fff;
  border: 1rpx solid #d4d7de;
}

.co-button[type=default][disabled] {
  color: #a8abb2;
  background-color: #fff;
  border-color: #e4e7ed;
}

$themes: primary, success, info, warning, danger;
$theme-colors: $co-color-primary, $co-color-success, $co-color-info, $co-color-warning, $co-color-danger;
$light1-colors: $co-color-primary-light1, $co-color-success-light1, $co-color-info-light1, $co-color-warning-light1, $co-color-danger-light1;
$light2-colors: $co-color-primary-light2, $co-color-success-light2, $co-color-info-light2, $co-color-warning-light2, $co-color-danger-light2;
$light3-colors: $co-color-primary-light3, $co-color-success-light3, $co-color-info-light3, $co-color-warning-light3, $co-color-danger-light3;

@mixin co-button-normal($type) {
  color: #fff;
  background: $type;
}
@mixin co-button-plain($type, $bg, $border) {
  color: $type;
  background: $bg;
  border: 1rpx solid $border;
}
@mixin co-button-disabled($bg) {
  color: #fff;
  background: $bg;
}
@mixin co-button-plain-disabled($color, $bg, $border) {
  color: $color;
  background: $bg;
  border-color: $border;
}

@each $theme in $themes {
  $i: index($themes, $theme);
  $newtheme: nth($theme-colors, $i);
  $light1-color: nth($light1-colors, $i);
  $light2-color: nth($light2-colors, $i);
  $light3-color: nth($light3-colors, $i);

  .co-button[type=#{$theme}] {
    @include co-button-normal($newtheme);
  }
  .co-button[type=#{$theme}][plain] {
    @include co-button-plain($newtheme, $light3-color, $light1-color);
  }
  .co-button[type=#{$theme}][disabled] {
    @include co-button-disabled($light1-color);
  }
  .co-button[type=#{$theme}][plain][disabled] {
    @include co-button-plain-disabled($light1-color, $light3-color, $light2-color);
  }
}
</style>
