<template>
	<view class="co-search">
		<view v-if="fixed" id="paddingBox" :style="paddingStyle"></view>
		<view id="contentBox" class="content-box" :style="boxStyle">
			<slot name="searchTop"></slot>
			<view class="content-box__main" :style="contentStyle">
				<view class="content-box__main--left">
					<CoSvgIcon
						icon="search"
						color="#ccc"
						size="20"
					></CoSvgIcon>
					<input
            class="input"
            type="text"
						:value="modelValue[inputField]"
						:placeholder="placeholder"
						:placeholder-style="placeholderStyle"
						@input="onInput"
					/>
				</view>
				<view class="content-box__main--right">
					<view class="icon_list">
						<CoSvgIcon
							v-if="filter"
							icon="filter"
							color="#1689F5"
							size="22"
							class="co-padding-left-24"
							@click="showFilter = !showFilter"
						></CoSvgIcon>
						<slot name="toolbar"></slot>
					</view>
					<view v-if="defaultButton" class="co-padding-left-24" @click="$emit('search')">搜索</view>
				</view>
			</view>
			<slot name="searchBottom"></slot>
		</view>
		<CoPopup
      v-if="filter"
      v-model="showFilter"
      placement="top"
      position="absolute"
      :fixed="popupFixed"
      @zIndexChange="onZIndexChange"
      @closed="onClosed"
    >
			<CoForm
				v-model="modelValue"
				:options="options || []"
				:is-format="isFormat"
				@click="onClick"
			></CoForm>
			<view v-if="!$slots.filterFooter" class="filter-footer">
				<view class="reset co-flex-center" @click="filterReset">重置</view>
				<view class="search co-flex-center" @click="searchEvent">搜索</view>
			</view>
			<slot v-else name="filterFooter"></slot>
		</CoPopup>
	</view>
</template>

<script>
import CoPopup from '../co-popup/co-popup'
import CoForm from '../co-form/co-form'
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

/**
 * Search
 * @description 搜索组件
 * @property {Object} v-model 搜索条件
 * @property {String} input-field 输入框的搜索值字段名
 * 	@default 'searchText'
 * @property {String} placeholder 输入框的占位符
 * @property {String} placeholder-color 输入框的占位符颜色
 * @property {String} color 输入框文字颜色
 * @property {String} background 输入框背景颜色
 * @property {Boolean} border 是否需要边框
 * 	@default true
 * @property {Boolean} filter 是否需要搜索条件
 * @property {Array<object>} filter-options 筛选条件，表单配置
 * @property {Boolean} default-button 是否需要默认的搜索按钮，默认不需要，自动搜索
 * @property {Boolean} is-format 是否格式化搜索条件，只保留 filterOptions 里面的字段
 * 	@default true
 * @property {Boolean} fixed 是否固定在顶部
 * 	@default true
 * @event search 点击搜索按钮或者自动搜索时触发
 * @event reset 点击重置按钮时触发
 * @event * 自定义事件名 点击搜索条件表单的表单项 labelType = arrow 时触发
 */

export default {
	name: 'CoSearch',
	components: {
    CoPopup,
    CoForm,
    CoSvgIcon,
  },
	props: {
		value: {
			type: [Object, null],
			required: true,
			default: () => ({})
		},
		inputField: {
			type: String,
			required: true,
			default: 'searchText'
		},
		placeholder: {
			type: String,
			default: '请输入搜索关键字'
		},
		placeholderColor: {
			type: String,
			default: '#999'
		},
		color: {
			type: String,
			default: '#333'
		},
		background: {
			type: String,
			default: '#fff'
		},
		border: {
			type: Boolean,
			default: true
		},
		filter: {
			type: Boolean,
			default: false
		},
		filterOptions: {
			type: Array,
			default: () => ([])
		},
		defaultButton: {
			type: Boolean,
			default: false
		},
		isFormat: {
			type: Boolean,
			default: true
		},
		fixed: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			timer: null,
			showFilter: false,
      popupFixed: '',
			zIndex: 10, // 用来控制 contentBox 的 z-index
			paddingStyle: '', // 用来填补 fixed 时的盒子空间
		}
	},
	computed: {
		modelValue: {
			get() {
				return new Proxy(this.value, {
					set: (target, key, value) => {
						Reflect.set(target, key, value)
						this.$emit('input', target)
						return true
					}
				})
			},
			set(val) {
				this.$emit('input', val)
			}
		},
		placeholderStyle() {
			return `color: ${this.placeholderColor}; font-size: 30rpx;`
		},
		contentStyle() {
			let base = `color:${this.color}; background:${this.background};`
			if (this.border) {
				base += 'border-top: 1rpx solid #EEEEEE; border-bottom: 1rpx solid #EEEEEE;'
			}
			return base
		},
		boxStyle() {
			let style = `z-index: ${this.zIndex};`

			if (this.fixed) {
				style += 'position: fixed; top: 0; left: 0;'
			}

			return style
		},
		options() {
			return [
				...this.filterOptions,
				{ field: this.inputField, hidden: true }
			]
		}
	},
	mounted() {
		this.setLayoutInfo()
	},
	methods: {
		setLayoutInfo() {
			const query = uni.createSelectorQuery().in(this)
			query.select('#contentBox').boundingClientRect()
			query.select('#paddingBox').boundingClientRect()
			query.exec((data) => {
				if (!data[0]) return

				let top = 0
				if (data[1]) {
					top = Number(data[1].top.toFixed(1))
				}
				else {
					top = Number(data[0].top.toFixed(1))
				}
        const height = Number(data[0].height.toFixed(1))

				// console.log('得到布局位置信息' + JSON.stringify(data))
				// console.log('节点离页面顶部的距离为' + top)
				// console.log('节点高度为' + height)

				this.popupFixed = `${top + height}px`
				this.paddingStyle = `height: ${height}px;`
			})
		},
		onInput({ detail: { value } }) {
			this.modelValue[this.inputField] = value
			// 如果没有默认的搜索按钮，则需要自动搜索
			if (!this.defaultButton) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.$emit('search')
				}, 500)
			}
		},
		searchEvent() {
			this.showFilter = false
			this.$emit('search')
		},
		filterReset() {
			this.modelValue = {}
			this.$emit('reset')
			this.searchEvent()
		},
		onZIndexChange(e) {
      if (!this.showFilter) return

			this.zIndex = e
		},
		onClosed() {
			this.zIndex = 10
		},
		onClick(data) {
			this.$emit(data.emitName)
		},
    setShowFilter(e) {
      this.showFilter = e
    },
	}
}
</script>

<style lang="scss" scoped>
.co-search {
	.content-box {
		position: relative;
		width: 100%;
		background: #F8F8F8;
    z-index: 10;

		&__main {
			height: 88rpx;
			display: flex;
			align-items: center;
			padding: 12rpx 24rpx;
			color: #333;
			background: #fff;
			box-sizing: border-box;

			&--left {
				display: flex;
				align-items: center;
				flex: 1;
				height: 100%;
				padding: 0 12rpx;
				background: rgba(0,0,0,0.06);
				border-radius: 8rpx;
				overflow: hidden;

				.input {
					width: 100%;
					padding-left: 12rpx;
				}
			}

			&--right {
				display: flex;
				align-items: center;
				font-size: 30rpx;

				.icon_list {
					display: flex;
					align-items: center;
					color: #1689F5;
				}
			}
		}
	}

	.filter-footer {
		display: flex;
		height: 88rpx;
		border-top: 1rpx solid #EEEEEE;

		.reset, .search {
			flex: 1;
			color: #fff;
			overflow: hidden;
		}

		.reset {
			background: #999;
		}

		.search {
			background: #1689F5;
			border-left: 1rpx solid #EEEEEE;
		}
	}
}
</style>
