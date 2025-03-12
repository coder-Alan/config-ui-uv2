<template>
	<view class="co-tree-item" :class="isOpen ? 'co-tree-item-opened' : ''" :style="itemStyle">
		<view class="co-tree-item__node">
			<template v-if="isLeaf">
				<view class="co-tree-item__node__leaf" :class="{ 'co-tree-item__node__checked': isChecked }" @click="clickLeafNode(fullData)">{{ nodeData[props.label] }}</view>
			</template>
			<template v-else>
				<view class="co-tree-item__node__content" @click.capture="tabOpen">
					<view class="co-tree-item__node__content__icon">
						<CoSvgIcon icon="arrowRight"></CoSvgIcon>
					</view>
					<view v-if="loading" class="co-loading-circle"></view>
					<view class="co-tree-item__node__content__label" :class="{ 'co-tree-item__node__checked': isChecked }">{{ nodeData[props.label] }}</view>
				</view>
			</template>
			<CoCheckbox
				v-if="canShowCheckbox"
				class="co-tree-item__node__checkbox"
				:value="id"
				:checked="isChecked"
				:indeterminate="isIndeterminate"
				:disabled="disabled.includes(id)"
				@change="onCheckboxChange"
			></CoCheckbox>
		</view>
		<template v-if="isShow">
			<CoTreeItem
				v-for="item in children"
				:key="item[idName]"
				ref="treeItem"
				:single-checked-id="singleCheckedId"
				:multiple-checked-id-list="multipleCheckedIdList"
				:data="item"
				:props="props"
				:load="load"
				:lazy="lazy"
				:disabled="disabled"
				:multiple="multiple"
				:show-checkbox="showCheckbox"
				:only-leaf="onlyLeaf"
				:parent-nodes="path"
				:parent-checked="itemCheckedList.includes(item[idName])"
				:level="level + 1"
				:id-separator="idSeparator"
        :has-default-value="hasDefaultValue"
				@check="onCheck"
				@multiple-self-check="onMultipleSelfCheck"
				@statusChange="onStatusChange"
				@click="clickLeafNode"
			></CoTreeItem>
		</template>
	</view>
</template>

<script>
import CoTreeItem from '../co-tree-item/co-tree-item'
import CoSvgIcon from '../co-svg-icon/co-svg-icon'
import CoCheckbox from '../co-checkbox/co-checkbox'

/**
 * TreeItem
 * @description 树形控件节点
 * @property {String} single-checked-id 单选时选中的id
 * @property {Array<string>} multiple-checked-id-list 多选时选中的id数组
 * @property {Object} data 数据源
 * @property {Object} props 配置选项，具体配置见下表
 * @property {String} props.id 指定节点id为节点对象的某个属性值
 * @property {String} props.label 指定节点标签为节点对象的某个属性值
 * @property {String} props.children 指定子树为节点对象的某个属性值
 * @property {String} props.isLeaf 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
 * @property {Boolean} show-checkbox 是否显示多选框，节点是否可被选择
 * @property {Boolean} only-leaf 是否仅在叶子节点才显示多选框，仅在 showCheckbox=true 时生效
 * @property {Boolean} multiple 是否多选
 * @property {Boolean} lazy 是否启用懒加载
 * @property {Function} load 懒加载的方法
 * @property {Array} disabled 复选框禁用数组，存储 id，仅 showCheckbox=true 时生效
 * @property {Array<object>} parent-nodes 父节点数组，用于拼接节点的路径
 * @property {Boolean} parent-checked 父节点是否被选中，用于判断子节点是否被选中
 * @property {Number} level 节点的层级，用于计算缩进
 * @property {String} id-separator id分隔符，默认为 - ，如果设置了 defaultValue 默认值，务必设置 idSeparator
 * @property {Boolean} has-default-value 是否有默认值，用于判断是否需要设置默认选中状态
 * @event check 点击的节点选中状态发生变化时触发，回调参数为当前节点数据、当前节点是否被选中、当前所有已选中的节点数据
 * @event check-change 相关的节点选中状态发生变化时触发，回调参数为当前节点数据、当前节点是否被选中、当前所有已选中的节点数据
 * @event click 点击叶子节点时触发，回调参数为当前节点数据
 * @example <co-tree :data="data" :props="props" :show-checkbox="true" :multiple="true" @check="onCheck"></co-tree>
 */

export default {
	name: 'CoTreeItem',
	components: {
    CoTreeItem,
    CoSvgIcon,
    CoCheckbox,
  },
	props: {
		singleCheckedId: {
			type: String,
			default: ''
		},
		multipleCheckedIdList: {
			type: Array,
			default: () => []
		},
		data: {
			type: Object,
			default: () => ({})
		},
		props: {
			type: Object,
			default: () => ({})
		},
		// 节点是否可被选择
		showCheckbox: {
			type: Boolean,
			default: false
		},
		// 是否只有最后的节点才显示多选框
		onlyLeaf: {
			type: Boolean,
			default: false
		},
		// 是否多选
		multiple: {
			type: Boolean,
			default: false
		},
		// 是否启用懒加载
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
		// 复选框禁用数组，存储id
		disabled: {
			type: Array,
			default: () => ([])
		},
		parentNodes: {
			type: Array,
			required: true,
			default: () => ([])
		},
		parentChecked: {
			type: Boolean,
			default: false
		},
		level: {
			type: Number,
			default: 1
		},
    // id分隔符，仅在设置默认选中值时生效
    idSeparator: {
      type: String,
      default: '-'
    },
		hasDefaultValue: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			nodeData: this.data,
			isOpen: false,
			isChecked: false,
			loading: false,
			current: '',
			itemCheckedList: [], // 子节点选中的集合
			isIndeterminate: false, // 设置不确定状态，仅负责样式控制
			isShow: false,
      height: 'unset',
		}
	},
	computed: {
		idName() {
			return this.props.id
		},
		id() {
			return this.nodeData[this.idName]
		},
		children() {
			return this.nodeData[this.props.children] || []
		},
		childIdList() {
			return this.children.map(item => item[this.idName])
		},
		path() {
			return [
				...this.parentNodes, 
				{
					[this.props.id]: this.nodeData[this.props.id],
					[this.props.label]: this.nodeData[this.props.label]
				}
			]
		},
		fullData() {
			return {
				...this.nodeData,
				path: this.path
			}
		},
		isLeaf() {
			if (this.lazy) {
        return this.nodeData[this.props.isLeaf]
      }
      else {
        return !this.children.length
      }
		},
		// 是否可以显示复选框
		canShowCheckbox() {
			return this.showCheckbox
				? this.onlyLeaf
					? this.isLeaf
					: true
				: false
		},
    itemStyle() {
      return `--close-height: ${this.height}px;`
    },
	},
	created() {
		if (this.multiple) {
			this.$watch(
				() => this.parentChecked,
				(val) => {
					if (val === this.isChecked) return

					// 将父组件的 checked 状态赋值给当前组件的 isChecked 属性
					this.isChecked = val

					// 如果新的 checked 状态为 true
					if (val) {
						// 将 isIndeterminate 状态设置为 false，表示当前组件的选中状态是确定的
						this.isIndeterminate = false
						// 选中所有子组件，将所有子组件的 id 收集到 itemCheckedList 数组中
						this.itemCheckedList = this.childIdList
						this.onMultipleSelfCheck(this.fullData, true)
					}
					// 如果新的 checked 状态为 false
					else {
						// 并且如果 isIndeterminate 状态为 false，说明没有选中的子组件
						if (!this.isIndeterminate) {
							// 将 itemCheckedList 数组清空
							this.itemCheckedList = []
							this.onMultipleSelfCheck(this.fullData, false)
						}
					}
				},
				{
					immediate: false
				}
			)
		}

		const initwatch = this.$watch(
			() => this.isOpen,
			(val) => {
				if (val) {
					this.isShow = true
					initwatch()
				}
			}
		)

		this.handleDefaultChecked()

		if (this.isLeaf) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select('.co-tree-item__node')
        .boundingClientRect((data) => {
          const height = Math.round(data.height)
          this.height = height > 30 ? height + 10 : 40
        })
        .exec();
    }
    else {
      this.height = 40
    }
	},
	methods: {
		handleDefaultChecked() {
			if (this.hasDefaultValue && !this.onlyLeaf) {
				if (this.multiple) {
					if (this.multipleCheckedIdList.includes(this.id) || this.parentChecked) {
						this.isChecked = true
						this.itemCheckedList = this.childIdList
						this.onMultipleSelfCheck(this.fullData, true)
					}
					else if (this.children.length) {
						const childIdList = []
						for (let i = 0; i < this.multipleCheckedIdList.length; i++) {
							if (this.isStartWith(this.multipleCheckedIdList[i], this.id + this.idSeparator)) {
								childIdList.push(this.multipleCheckedIdList[i])
							}
						}

						const itemCheckedList = childIdList.filter(item => this.childIdList.includes(item))

						if (itemCheckedList.length === this.children.length) {
							this.isChecked = true
							this.itemCheckedList = this.childIdList
							this.onMultipleSelfCheck(this.fullData, true)
						}
						else if (childIdList.length > 0) {
							this.isIndeterminate = true
							this.itemCheckedList = itemCheckedList
						}
					}
				}
				else {
					if (this.singleCheckedId === this.id) {
						this.isChecked = true
						this.setSingleCheckedIdWatch()
					}
				}
			}
		},
		clickLeafNode(e) {
			if (this.showCheckbox) return

			this.$emit('click', e)
		},
		onCheckboxChange(e) {
			this.isChecked = !!e

			if (this.isChecked) this.isIndeterminate = false

			if (!this.multiple && this.isChecked) {
				this.setSingleCheckedIdWatch()
			}

			// 是多选且所有节点显示复选框，才触发checkChange事件
			if (this.multiple && !this.onlyLeaf) {
				if (this.isChecked) {
					this.itemCheckedList = this.childIdList
				}
				else {
					this.itemCheckedList = []
				}

				this.$emit('statusChange', this.fullData, this.isChecked)
			}

			this.onCheck(this.fullData, this.isChecked)
		},
		handleMultipleChecked(checkedInfo) {
			if (this.multiple) {
				if (!checkedInfo) {
					checkedInfo = {
						checkedNodes: [],
						deletedKeys: []
					}
				}

				if (this.isChecked) {
					checkedInfo.checkedNodes.unshift(this.nodeData)
				}
				else {
					checkedInfo.deletedKeys.unshift(this.id)
				}
			}

			return checkedInfo
		},
		onMultipleSelfCheck(...arg) {
			let [data, checked, checkedInfo] = arg
			checkedInfo = this.handleMultipleChecked(checkedInfo)

			this.$emit('multiple-self-check', data, checked, checkedInfo)
			this.$emit('statusChange', this.fullData, this.isChecked)
		},
		onCheck(...arg) {
			// console.log('itemChange', this.id, this.isChecked)
			let [data, checked, checkedInfo] = arg
			checkedInfo = this.handleMultipleChecked(checkedInfo)

			this.$emit('check', data, checked, checkedInfo)
		},
		onStatusChange(...arg) {
			const [data, checked] = arg
			const changeId = data[this.idName]

			if (!checked) {
				this.isChecked = false
			}

			if (this.childIdList.includes(changeId)) {
				if (!checked) {
					this.itemCheckedList = this.itemCheckedList.filter(item => item !== changeId)
				}
				else if (!this.itemCheckedList.includes(changeId)) {
					this.itemCheckedList.push(changeId)
				}
			}

			if (this.itemCheckedList.length === this.children.length) {
				this.isChecked = true
				this.isIndeterminate = false
			}
			else if (this.itemCheckedList.length) {
				this.isIndeterminate = true
			}
			else {
				let isIndeterminate = false
				for (let i = 0; i < this.$refs.treeItem.length; i++) {
					const item = this.$refs.treeItem[i]
					if (item.isIndeterminate) {
						isIndeterminate = true
						break
					}
				}
				this.isIndeterminate = isIndeterminate
			}

			this.$emit('statusChange', this.nodeData, this.isChecked)
		},
		tabOpen() {
			if (this.loading) return

			this.isOpen = !this.isOpen

			if (this.lazy && !this.nodeData[this.props.isLeaf] && !this.children.length) {
				this.loading = true
				this.load(this.id)
					.then(res => {
						this.$set(this.nodeData, this.props.children, res)
						if (this.isChecked) {
							this.itemCheckedList = res.map(item => item[this.idName])
						}
						this.loading = false
					})
			}
		},
		// 定义一个名为 isStartWith 的方法，用于判断字符串是否以指定的前缀开头
		isStartWith(str, prefix) {
			// 创建一个正则表达式对象，用于匹配以 prefix 开头的字符串
			// `^` 表示字符串的开始位置，`${prefix}` 是传入的前缀
			const regex = new RegExp(`^${prefix}`);
			// 使用正则表达式的 test 方法检测字符串 str 是否符合正则表达式
			// 如果符合，返回 true；否则返回 false
			return regex.test(str);
		},
		setSingleCheckedIdWatch() {
			const singleWatch = this.$watch(
				() => this.singleCheckedId,
				(val) => {
					if (this.isChecked && val !== this.id) {
						this.isChecked = false
						singleWatch()
					}
				},
			)
		},
	}
}
</script>

<style lang="scss" scoped>
@mixin center($align, $justify) {
	display: flex;
	align-items: $align;
	justify-content: $justify;
}

.co-tree-item {
  height: var(--close-height);
	margin-left: 20rpx;
	overflow: hidden;

	&__node {
		@include center(center, space-between);
    height: var(--close-height);
		border-bottom: 1px solid #eee;
		box-sizing: border-box;

		&__leaf {
			@include center(center, unset);
			flex: 1;
			height: 100%;
			margin-left: 42rpx;
			overflow: hidden;
		}

		&__content {
			@include center(center, unset);
			flex: 1;
			height: 100%;
			overflow: hidden;

			&__icon {
				transition: all .3s;
			}

			&__label {
				padding-left: 10rpx;
			}
		}

		&__checkbox {
			padding-right: 20rpx;
			// transform: scale(0.8);
		}

		&__checked {
			color: #1689F5;
		}
	}
}

.co-tree-item-opened {
	height: unset;

	> .co-tree-item__node {
		.co-tree-item__node__content__icon {
			transform: rotate(90deg);
		}
	}
}
</style>
