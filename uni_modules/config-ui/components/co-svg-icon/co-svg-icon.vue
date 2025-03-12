<template>
  <text class="icon" :class="customClass" :style="[style]" @click="$emit('click')"></text>
</template>

<script>
import svg from './svg.js'
import { changeSvgColor } from './index.js'
import { getCssSize } from '../../utils/index.js'

/**
 * SvgIcon
 * @description Svg图标，支持自定义svg和内置svg
 * @property {String} icon 图标名称
 * @property {String|Number} size 图标大小
 * @property {String} color 图标颜色，16进制
 * @property {String} svg 自定义svg
 * @property {String|Array<string>} custom-class 自定义class
 * @event click 点击图标时触发
 */

export default {
  name: 'CoSvgIcon',
  props: {
    icon: {
      type: [String, null],
      default: '',
    },
    size: {
      type: [String, Number],
      default: '16',
    },
    color: {
      type: [String, null],
      default: '#999',
    },
    svg: {
      type: String,
      default: ''
    },
    customClass: {
      type: [String, Array],
      default: ''
    }
  },
  computed: {
    style () {
      const svgSource = this.icon && svg[this.icon] ? svg[this.icon] : this.svg

      if (!svgSource) return {}

      let color = this.color
      if (color.indexOf('rgb') !== -1) {
        color = this.rgbStringToHex(color)
      }

      return {
        width: getCssSize(this.size),
        height: getCssSize(this.size),
        backgroundImage: `url(${changeSvgColor(svgSource, color)})`
      }
    }
  },
  methods: {
    rgbStringToHex(rgbString) {
      // 使用正则表达式从字符串中提取RGB值
      const rgbValues = rgbString.match(/\d+/g);
      if (!rgbValues || rgbValues.length !== 3) {
          throw new Error('Invalid RGB string format');
      }

      const r = parseInt(rgbValues[0], 10);
      const g = parseInt(rgbValues[1], 10);
      const b = parseInt(rgbValues[2], 10);

      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }
  },
}
</script>

<style lang="scss" scoped>
.icon {
  display: inline-flex;
  background-size: contain;
  background-repeat: no-repeat;
  vertical-align: middle;
}
</style>
