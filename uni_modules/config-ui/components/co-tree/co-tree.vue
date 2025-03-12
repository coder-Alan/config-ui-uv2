<template>
  <view class="co-tree">
    <template v-if="data.length">
      <CoTreeItem
        v-for="item in data"
        :key="item[id]"
        ref="treeItem"
        :single-checked-id="singleId"
        :multiple-checked-id-list="multipleIdList"
        :data="item"
        :props="props"
        :load="load"
        :lazy="lazy"
        :multiple="multiple"
        :disabled="disabled"
        :show-checkbox="showCheckbox"
        :only-leaf="onlyLeaf"
        :has-default-value="hasDefaultValue"
        @check="onCheck"
        @multiple-self-check="onMultipleSelfCheck"
        @click="onClick"
      ></CoTreeItem>
    </template>
  </view>
</template>

<script>
import CoTreeItem from '../co-tree-item/co-tree-item'

/**
 * Tree
 * @description 树形控件
 * @property {String|Array<string>} default-value 默认值，单选时为id，多选时为id数组
 * @property {Array} data 树形控件的数据源
 * @property {Object} props 配置选项，具体配置见下表
 * @property {String} props.id 指定节点id为节点对象的某个属性值
 * @property {String} props.label 指定节点标签为节点对象的某个属性值
 * @property {String} props.children 指定子树为节点对象的某个属性值
 * @property {String} props.isLeaf 指定节点是否为叶子节点，仅在 lazy=true 的情况下生效
 * @property {Boolean} show-checkbox 是否显示多选框，节点是否可被选择
 * @property {Boolean} only-leaf 是否仅在叶子节点才显示多选框，仅在 showCheckbox=true 时生效
 * @property {Boolean} multiple 是否多选
 * @property {Boolean} lazy 是否启用懒加载
 * @property {Function} load 加载子树数据的方法，仅当 lazy 属性为true 时生效
 * @property {Array} disabled 复选框禁用数组，存储 id，仅 showCheckbox=true 时生效
 * @property {String} id-separator id分隔符，默认为 - ，如果设置了 defaultValue 默认值，务必设置 idSeparator
 * @event check 点击的节点选中状态发生变化时触发，回调参数为当前节点数据、当前节点是否被选中、当前所有已选中的节点数据
 * @event check-change 相关的节点选中状态发生变化时触发，回调参数为当前节点数据、当前节点是否被选中、当前所有已选中的节点数据
 * @event click 点击叶子节点时触发，回调参数为当前节点数据
 * @example <co-tree :data="data" :props="props" :show-checkbox="true" :multiple="true" @check="onCheck"></co-tree>
 */

export default {
  name: 'CoTree',
  components: {
    CoTreeItem,
  },
  props: {
    defaultValue: {
			type: [String, Array],
			default: ''
		},
    data: {
      type: Array,
      default: () => ([])
    },
    props: {
      type: Object,
      default: () => ({
        id: 'id',
        label: 'label',
        children: 'children',
        isLeaf: 'isLeaf'
      })
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    onlyLeaf: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function,
      default: () => {
        return function() {}
      }
    },
    disabled: {
      type: Array,
      default: () => ([])
    },
    idSeparator: {
      type: String,
      default: '-'
    },
  },
  data() {
    return {
      multipleData: new Map(), // 多选数据
      singleId: '', // 单选选中的id
      hasDefaultValue: false, // 是否设置了默认值
    }
  },
  computed: {
    id() {
      return this.props.id
    },
    multipleIdList() {
      return Array.from(this.multipleData.keys()) || []
    }
  },
  watch: {
    defaultValue: {
      handler(val) {
        if (!val) return

        this.hasDefaultValue = true

        if (this.multiple) {
          if (Reflect.toString.call(val) !== '[object Array]') throw new Error('defaultValue must be an array');

          const newMap = new Map()
          val.forEach(item => {
            newMap.set(item, item)
          })
          this.multipleData = newMap
        }
        else {
          this.singleId = val
        }
      },
      immediate: true
    }
  },
  methods: {
    onMultipleSelfCheck(data, isChecked, checkedInfo) {
      for (let i = 0; i < checkedInfo.checkedNodes.length; i++) {
        this.multipleData.set(checkedInfo.checkedNodes[i][this.id], checkedInfo.checkedNodes[i])
      }

      for (let i = 0; i < checkedInfo.deletedKeys.length; i++) {
        this.multipleData.delete(checkedInfo.deletedKeys[i])
      }

      const checkedKeys = Array.from(this.multipleData.keys())

      if (this.defaultValue.toString() === checkedKeys.toString()) return

      checkedInfo = {
        checkedKeys,
        checkedNodes: Array.from(this.multipleData.values())
      }

      this.$emit('check-change', data, isChecked, checkedInfo)
    },
    onCheck(data, isChecked, checkedInfo) {
      // 多选
      if (this.multiple) {
        for (let i = 0; i < checkedInfo.checkedNodes.length; i++) {
          this.multipleData.set(checkedInfo.checkedNodes[i][this.id], checkedInfo.checkedNodes[i])
        }

        for (let i = 0; i < checkedInfo.deletedKeys.length; i++) {
          this.multipleData.delete(checkedInfo.deletedKeys[i])
        }

        checkedInfo = {
          checkedKeys: Array.from(this.multipleData.keys()),
          checkedNodes: Array.from(this.multipleData.values())
        }

        this.$emit('check', data, isChecked, checkedInfo)
      }
      // 单选
      else {
        this.singleId = data[this.id]
        this.$emit('check', data, isChecked)
      }
    },
    getCheckedNodes(nodes) {
      nodes.forEach(item => {
        item.getCheckedNodes()
      })
    },
    onClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.co-tree {
  font-size: 30rpx;
  background: #fff;
}
</style>
