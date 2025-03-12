<template>
	<CoPopup v-model="showModelValue" @closed="$emit('closed')">
		<view class="co-picker">
			<CoPickerHeader
				:title="title"
				:clear="clear"
				@clear="onClear"
				@confirm="onConfirm"
			></CoPickerHeader>
			<template v-if="list && list.length">
				<!-- 单选 -->
				<picker-view
					v-if="!multiple"
					class="co-picker__content"
					:value="[defaultCheck]"
					immediate-change
					@change="onChange"
				>
					<picker-view-column>
						<view
							v-for="item in list"
							:key="item[valueKey]"
							class="co-picker__content__item co-singe-ellipsis"
						>{{ item[labelKey] }}</view>
					</picker-view-column>
				</picker-view>
				<!-- 多选 -->
				<scroll-view v-else scroll-y="true" class="co-picker__content">
					<CoCheckBar
						v-for="(item, index) in list"
						:key="item[valueKey]"
						:index="index"
						:data="item"
						:checked="multipleCheckedMap.has(index)"
						multiple
						@change="multipleChange"
					>
						<view class="co-picker__content__multiple-item">
							{{ item[labelKey] }}
						</view>
					</CoCheckBar>
				</scroll-view>
			</template>
			<view v-else class="co-picker__tip-null">
				暂无数据
			</view>
		</view>
	</CoPopup>
</template>

<script>
import CoPopup from '../co-popup/co-popup'
import CoPickerHeader from '../co-picker-header/co-picker-header'
import CoCheckBar from '../co-check-bar/co-check-bar'

/**
 * Picker
 * @description 选择器
 * @property {Boolean} show 是否显示选择器
 * @property {Array<object>} list 选择器数据
 * @property {String} title 选择器标题
 * @property {String} label-key 数据项名称字段
 * @property {String} value-key 数据项值字段
 * @property {Boolean} multiple 是否多选
 * @property {Boolean} clear 是否显示清除按钮
 * 	@default true
 * @property {String|Number|Object|Array} default-value 默认选中值
 * @event {Function} update:show 设置 showModelValue 的值时触发
 * @event {Function} confirm 点击确定按钮触发，返回选中数据
 * @event {Function} clear 点击清除按钮触发
 * @event {Function} closed 弹框关闭后触发
 */

export default {
	name: 'CoPicker',
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
		list: {
			type: [Array, undefined],
			default: () => ([])
		},
		title: {
			type: [String, null],
			default: ''
		},
		labelKey: {
			type: [String, null],
			default: 'label'
		},
		valueKey: {
			type: [String, null],
			default: 'value'
		},
		multiple: {
			type: Boolean,
			default: false
		},
		clear: {
			type: Boolean,
			default: true
		},
		defaultValue: {
			type: [String, Number, Object, Array],
			default: ''
		},
	},
	data() {
		return {
			defaultCheck: 0, // 单选时，picker-view-column 默认显示第几项，数字大于 picker-view-column 可选项长度时，选择最后一项
			singleCheckedData: {}, // 单选，选中的数据
			multipleCheckedMap: new Map(), // 多选，选中的数据
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
		list: {
			handler() {
				this.getDefaultCheck(this.defaultValue)
			},
			immediate: true
		}
	},
	methods: {
		getDefaultCheck(data) {
			if (!this.list || (typeof data !== 'number' && !data)) return

			let value
			if (Reflect.toString.call(data) === '[object Object]') {
				value = data[this.valueKey]
			}
			else {
				value = data
			}

			if (!value && typeof(value) !== 'number') return

			if (this.multiple) {
				for (let i = 0; i < this.list.length; i++) {
					if (value.includes(this.list[i][this.valueKey])) {
						this.multipleCheckedMap.set(i, this.list[i])
					}
				}
			}
			else {
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i][this.valueKey] === value) {
						this.defaultCheck = i
						break
					}
				}
        this.singleCheckedData = this.list[this.defaultCheck]
			}
		},
		onChange({ detail: { value } }) {
			this.singleCheckedData = this.list[value[0]]
		},
		multipleChange(data, isCheck, index) {
			if (isCheck) {
				this.multipleCheckedMap.set(index, data)
			}
			else {
				this.multipleCheckedMap.delete(index)
			}
		},
		onConfirm() {
			if (!this.list || !this.list.length) return this.showModelValue = false

			let label
			let value
			if (!this.multiple) {
				label = this.singleCheckedData[this.labelKey]
				value = this.singleCheckedData[this.valueKey]
			}
			else {
				const multipleArr = Array.from(this.multipleCheckedMap).sort((a, b) => a[0] - b[0]).map(item => item[1])
				const labelArr = []
				value = []
				for (var i = 0; i < multipleArr.length; i++) {
					labelArr.push(multipleArr[i][this.labelKey])
					value.push(multipleArr[i][this.valueKey])
				}
				label = labelArr.join(',')
			}

			this.$emit('confirm', {
				label,
				value
			})
			this.showModelValue = false
		},
		onClear() {
			this.defaultCheck = 0
			this.singleCheckedData = undefined
			this.multipleCheckedMap = new Map()
			this.$emit('clear')
			this.showModelValue = false
		}
	}
}
</script>

<style lang="scss" scoped>
.co-picker {
	&__content {
		&__multiple-item {
			padding: 24rpx;
			color: #333;
			border-bottom: 1rpx solid #eee;
		}
	}

	&__tip-null {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		font-size: 28rpx;
		color: #aaa;
		overflow: hidden;
	}
}
</style>
