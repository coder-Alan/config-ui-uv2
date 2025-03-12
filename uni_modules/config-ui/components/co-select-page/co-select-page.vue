<template>
	<view class="co-select-page co-default-page">
		<CoSearch
			v-if="hasSearch"
			v-model="newSearchData"
			:filter="filter"
			:filter-options="filterOptions"
			:input-field="searchInputField"
			:default-button="!filter"
			@search="search"
		></CoSearch>
		<CoLoad
			ref="loadRef"
			v-model="list"
			:search-data="newSearchData"
			:load="load"
			:placeholder="placeholder"
			:init-search="initSearch"
			@listChange="onListChange"
		>
			<!-- multiple: false单/true多选 -->
			<CoCheckBar
				v-for="(item, index) in list"
				:key="item[valueKey]"
				:index="index"
				:data="item"
				:multiple="multiple"
				:checked="multiple ? Boolean(currentCheckIds[item[valueKey]]) : currentCheck[valueKey] === item[valueKey]"
				@change="onChange"
			>
				<view class="co-select-page__item">
					<!-- 由于小程序不支持循环中放入插槽，所以这里可自定义 slotType ，并引入对应的组件 -->
					<!-- 例如: <Example :data="item"></Example> -->
					<text>{{ item[labelKey] || '-' }}</text>
				</view>
			</CoCheckBar>
		</CoLoad>
		<slot v-if="$slots.footer" name="footer"></slot>
		<CoFooter v-else :options="[{ type: 'primary', text: '确定', methodName: 'click' }]" @click="onConfirm"></CoFooter>
	</view>
</template>

<script>
import CoSearch from '../co-search/co-search'
import CoLoad from '../co-load/co-load'
import CoCheckBar from '../co-check-bar/co-check-bar'
import CoFooter from '../co-footer/co-footer'

/**
 * SelectPage
 * @description 列表选择页面，支持单选和多选，支持搜索和条件筛选
 * @property {Object} search-data 接口的查询参数，其他参数也可以通过该字段传递，必传
 * @property {Function} load 加载列表数据的方法
 * @property {Boolean} init-search 是否需要在组件初始化时搜索
 * 	@default true
 * @property {String} placeholder 暂无数据时的提示语
 * @property {Boolean} filter 是否开启搜索条件筛选
 * @property {Array<object>} filter-options 搜索条件的表单配置
 * @property {String} search-input-field 搜索框的输入字段，属于 search-data 属性里的一个字段
 * @property {String} label-key 用于展示数据
 * @property {String} value-key 用于选中状态
 * @property {Boolean} multiple 是否多选
 * @property {Boolean} back 点击确认后是否返回上一个页面
 * 	@default true
 * @property {String} slot-type 使用插槽组件的类型，组件需自行引入
 * @property {Boolean} has-search 是否需要搜索框
 * 	@default true
 * @property {Array} default-value 默认选中数据
 * @property {Boolean} required 是否必须选择数据后才能点击确定按钮
 * 	@default true
 * @event confirm 点击确认按钮时触发
 * @event listChange 列表刷新时触发，返回当前列表数据
 * @event update:searchData 当查询参数改变时触发
 * @example <co-select-page :search-data.sync="searchData" :filter="true" :filter-options="filterOptions" :load="load" :multiple="true" @confirm="onConfirm" @listChange="onListChange"></co-select-page>
 */

export default {
	name: 'CoSelectPage',
	components: {
		CoSearch,
		CoLoad,
		CoCheckBar,
		CoFooter,
	},
	props: {
		searchData: {
			type: Object,
			required: true,
			default: () => ({})
		},
		filter: {
			type: Boolean,
			default: false
		},
		filterOptions: {
			type: Array,
			default: () => ([])
		},
		searchInputField: {
			type: String,
			default: 'searchText'
		},
		labelKey: {
			type: String,
			default: 'label'
		},
		valueKey: {
			type: String,
			default: 'value'
		},
		multiple: {
			type: Boolean,
			default: false
		},
		load: {
			type: Function,
			default: () => {
				return function() {
					return new Promise((resolve, reject) => {
						resolve({ list: [], totalPage: 0 })
					})
				}
			}
		},
		back: {
			type: Boolean,
			default: true
		},
		slotType: {
			type: String,
			default: ''
		},
		hasSearch: {
			type: Boolean,
			default: true
		},
		placeholder: {
			type: String,
			default: '暂无数据'
		},
		initSearch: {
			type: Boolean,
			default: true
		},
		defaultValue: {
			type: Array,
			default: () => ([])
		},
		required: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			list: [],
			currentCheck: {}, // 单选，选中的数据
			currentCheckIds: {} // 多选，选中的数据id集合
		}
	},
	computed:{
		newSearchData: {
			get() {
				return new Proxy(this.searchData, {
					set: (target, key, value) => {
						Reflect.set(target, key, value)
						this.$emit('update:searchData', target)
						return true
					}
				})
			},
			set(val) {
				this.$emit('update:searchData', val)
			}
		}
	},
	watch: {
		defaultValue: {
			handler(val) {
				if (this.multiple) {
					const ids = {}
					for (let i = 0; i < val.length; i++) {
						const id = val[i][this.valueKey]
						ids[id] = id
					}
					this.currentCheckIds = ids
				}
				else {
					this.currentCheck = val[0] || {}
				}
			},
			immediate: true
		}
	},
	methods: {
		scrolltolower() {
			this.$refs.loadRef.scrolltolower()
		},
		search() {
			this.$refs.loadRef.search()
		},
		onChange(data, isCheck, index) {
			if (this.multiple) {
				if (isCheck) {
					this.currentCheckIds[data[this.valueKey]] = data[this.valueKey]
				}
				else {
					delete this.currentCheckIds[data[this.valueKey]]
				}
			}
			else {
				if (isCheck) {
					this.currentCheck = data
				}
				else {
					this.currentCheck = {}
				}
			}
		},
		onConfirm() {
			let data
			if (this.multiple) {
				const ids = Object.values(this.currentCheckIds)
				if (ids.length) {
					data = []
					for (let i = 0; i < this.list.length; i++) {
						if (ids.includes(this.list[i][this.valueKey])) {
							data.push(this.list[i])
						}
					}
				}
			}
			else {
				if (Object.keys(this.currentCheck).length) {
					data = this.currentCheck
				}
			}
			if (this.required && !data) {
				uni.showToast({
					title: '请选择选项',
					icon: 'error'
				})
				return
			}
			this.back && uni.navigateBack()
			this.$emit('confirm', data)
		},
		onListChange(list = []) {
			this.$emit('listChange', list)
		}
	}
}
</script>

<style lang="scss" scoped>
.co-select-page {
	&__item {
		padding: 24rpx 70rpx 24rpx 24rpx;
		background: #fff;
		color: #333333;
		font-size: 30rpx;
		border-bottom: 1rpx solid #eee;
	}
}
</style>
