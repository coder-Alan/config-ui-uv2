<template>
	<CoPopup v-model="showModelValue">
		<view class="co-cascader">
			<CoPickerHeader :title="title" :clear="clear" @clear="onClear" @confirm="onConfirm"></CoPickerHeader>
			<view class="co-tabs">
				<view v-for="(item, index) in checkList" :key="index" class="co-tabs__item" @click="tabClick(index)">
					<text v-if="item" class="co-tabs__item-label">{{ item[labelKey] }}</text>
					<text v-else class="co-tabs__item-tip">请选择</text>
				</view>
				<view class="co-tabs__line" :style="lineStyle"></view>
			</view>
			<view class="co-option__container" :style="containerStyle">
				<scroll-view v-for="(item, index) in optionList" :key="index" scroll-y="true" class="co-option__container__list">
					<CoCheckBar
						v-for="subItem in item"
						:key="subItem[valueKey]"
						:index="index"
						:data="subItem"
						:checked="currChecked === subItem[valueKey]"
						:cancelable="false"
						@change="onCheckChange"
					>
						<view class="co-option__container__list__item">
							{{ subItem[labelKey] }}
						</view>
					</CoCheckBar>
				</scroll-view>
			</view>
		</view>
	</CoPopup>
</template>

<script>
import CoPopup from '../co-popup/co-popup'
import CoPickerHeader from '../co-picker-header/co-picker-header'
import CoCheckBar from '../co-check-bar/co-check-bar'

import {
	requestAnimationFrame
} from '../../utils/index.js'

/**
 * CoCascader
 * @description 级联选择器，用于多层级的数据选择，如选择城市等。
 * @property {Boolean} show 是否显示弹框
 * @property {String} title 弹框标题
 * @property {Boolean} clear 是否显示清除按钮
 * @property {Array<object>} options 选项数据
 * @property {String} label-key 选项数据中显示的键名
 * @property {String} value-key 选项数据中值的键名
 * @property {Boolean} emit-path 是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
 * @event update:show 设置 showModelValue 的值时触发
 * @event confirm 点击确认按钮触发
 * @event clear 点击清除按钮触发
 */

export default {
	name: 'CoCascader',
	components: {
		CoPopup,
		CoPickerHeader,
		CoCheckBar,
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		title: {
			type: [String, null],
			default: ''
		},
		clear: {
			type: Boolean,
			default: true
		},
		options: {
			type: [Array, null],
			default: () => ([])
		},
		labelKey: {
			type: [String, null],
			default: 'label'
		},
		valueKey: {
			type: [String, null],
			default: 'value'
		},
		emitPath: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			checkList: [null],
			currChecked: '',
			optionList: [],
			lineStyle: '--line-x: 37px;--line-width: 40px;',
			containerStyle: '--translate-x: 0px;',
		}
	},
	computed: {
		showModelValue: {
			get() {
				return this.show
			},
			set(val) {
				this.$emit('update:show', val)
			}
		}
	},
	watch: {
		options: {
			handler(val) {
				this.optionList = [val]
			},
			immediate: true
		}
	},
	methods: {
		onCheckChange(e, isCheck, index) {
			if (this.currChecked === e[this.valueKey]) return

			this.currChecked = e[this.valueKey]
			if (index === this.checkList.length - 1) {
				this.checkList[this.checkList.length - 1] = e
				if (e.children && e.children.length) {
					this.checkList.push(null)
					this.optionList.push(e.children)
					this.containerStyle = `--translate-x: -${100 * (this.optionList.length - 1)}vw;`
				}
			}
			else {
				const nextIndex = index + 1
				if (e.children && e.children.length) {
					const checkList = this.checkList.slice(0, nextIndex)
					const optionList = this.optionList.slice(0, nextIndex)
					checkList[index] = e
					checkList.push(null)
					optionList.push(e.children)
					this.containerStyle = `--translate-x: -${100 * nextIndex}vw;`
					this.checkList = checkList
					this.optionList = optionList
				}
				else {
					this.checkList.splice(nextIndex)
					this.checkList[this.checkList.length - 1] = e
					this.optionList.splice(nextIndex)
				}
			}

			requestAnimationFrame(() => {
				this.getRect()
			})
		},
		getRect(index) {
			const query = uni.createSelectorQuery().in(this);
			query
				.selectAll('.co-tabs__item')
				.boundingClientRect((data) => {
					const i = typeof(index) === 'number' ? index : data.length - 1
					const lastDom = data[i]
					this.lineStyle = `--line-x: ${lastDom.left + lastDom.width / 2}px;--line-width: ${lastDom.width}px;`
				})
				.exec();
		},
		tabClick(index) {
			const item = this.checkList[index]
			if (!item) return
			this.currChecked = item[this.valueKey]
			this.containerStyle = `--translate-x: -${100 * index}vw;`
			this.getRect(index)
		},
		onConfirm() {
			const newCheckList = []
			for (let i = 0; i < this.checkList.length; i++) {
				if (this.checkList[i] === null) return

				newCheckList.push({
					label: this.checkList[i][this.labelKey],
					value: this.checkList[i][this.valueKey],
				})
			}

			let data
			if (this.emitPath) {
				data = newCheckList
			}
			else {
				data = {
					label: newCheckList.map(item => item.label).join(' / '),
					value: newCheckList[newCheckList.length - 1].value
				}
			}
			this.$emit('confirm', data)
			this.showModelValue = false
		},
		onClear() {
			Object.assign(this, this.$options.data())
			this.optionList = [this.options]
			this.$emit('clear')

			this.showModelValue = false
		}
	}
}
</script>

<style lang="scss" scoped>
.co-cascader {
	font-size: 14px;

	.co-tabs {
		position: relative;
		display: flex;
		height: 96rpx;
		padding: 0 12rpx;

		&__item {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			margin: 0 20rpx;

			&-label {
				color: #333;
			}

			&-tip {
				color: #969799;
			}
		}

		&__line {
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 1;
			width: var(--line-width);
			height: 3px;
			background-color: $uni-color-primary;
			border-radius: 3px;
			transform: translateX(var(--line-x)) translateX(-50%);
			transition-duration: 0.3s;
		}
	}

	.co-option__container {
		display: flex;
		height: 40vh;
		transform: translateX(var(--translate-x));
		transition-duration: 0.3s;

		&__list {
			width: 100vw;
			height: 100%;
			flex-shrink: 0;

			&__item {
				padding: 18rpx 32rpx;
			}
		}
	}
}
</style>
