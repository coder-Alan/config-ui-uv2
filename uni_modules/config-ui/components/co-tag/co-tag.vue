<template>
  <view class="co-tag" :class="tagClass" :style="style">
    <slot></slot>
  </view>
</template>

<script>
/**
 * Tag
 * @description 标签，用于标记和选择
 * @property {String} type = [primary|success|info|warning|danger] 标签类型
 *  @value primary 主要
 *  @value success 成功
 *  @value info 信息
 *  @value warning 警告
 *  @value danger 危险
 *  @default primary
 * @property {String} effect = [light|dark|plain] 标签效果
 *  @value light 亮色
 *   @value dark 暗色
 *   @value plain 朴素
 *   @default light
 * @property {Boolean} hit 是否有边框描边
 * @property {Boolean} ellipsis 是否省略
 * @property {String} style 标签样式
 */

export default {
  name: 'CoTag',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    effect: {
      type: String,
      default: 'light'
    },
    hit: {
      type: Boolean,
      default: false
    },
    ellipsis: {
      type: Boolean,
      default: false
    },
    style: {
      type: String,
      default: ''
    },
  },
  computed: {
    tagClass() {
      let str = `co-tag--${this.type} co-tag--${this.effect}`
      if (this.ellipsis) str += ' is-ellipsis'
      if (this.hit) str += ' is-hit'
      return str
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';

.co-tag {
  display: inline-block;
	height: 42rpx;
	line-height: 42rpx;
	padding: 0 20rpx;
	vertical-align: middle;
	font-size: 22rpx;
  color: var(--co-tag-text-color);
  background-color: var(--co-tag-bg-color);
  border-color: var(--co-tag-border-color);
  border-width: 1rpx;
  border-style: solid;
	border-radius: 4rpx;
  white-space: nowrap;
	box-sizing: border-box;
}

.is-ellipsis {
  width: 100%;
  text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
	white-space: nowrap;
}

$themes: primary, success, info, warning, danger;
$theme-colors: $co-color-primary, $co-color-success, $co-color-info, $co-color-warning, $co-color-danger;
$light1-colors: $co-color-primary-light1, $co-color-success-light1, $co-color-info-light1, $co-color-warning-light1, $co-color-danger-light1;
$light2-colors: $co-color-primary-light2, $co-color-success-light2, $co-color-info-light2, $co-color-warning-light2, $co-color-danger-light2;
$light3-colors: $co-color-primary-light3, $co-color-success-light3, $co-color-info-light3, $co-color-warning-light3, $co-color-danger-light3;

@each $theme in $themes {
  $i: index($themes, $theme);
  $theme-color: nth($theme-colors, $i);
  $light1-color: nth($light1-colors, $i);
  $light2-color: nth($light2-colors, $i);
  $light3-color: nth($light3-colors, $i);

  .co-tag--#{$theme} {
    --co-tag-text-color: #{$theme-color};
    --co-tag-bg-color: #{$light3-color};
    --co-tag-border-color: #{$light2-color};
  }

  .co-tag--#{$theme}.is-hit {
    border-color: #{$theme-color};
  }

  .co-tag--dark.co-tag--#{$theme} {
    --co-tag-text-color: #fff;
    --co-tag-bg-color: #{$theme-color};
    --co-tag-border-color: #{$theme-color};
  }

  .co-tag--plain.co-tag--#{$theme} {
    --co-tag-text-color: #{$theme-color};
    --co-tag-bg-color: #fff;
    --co-tag-border-color: #{$light1-color};
  }
}
</style>
